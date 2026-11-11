import type { ServiceId } from './types'

/** How careful the customer should be before the shop inspects the item. */
export type DiagnosisSafety = 'standard' | 'caution' | 'urgent'

/** The answers the quick check collects at the last step. */
export type DiagnosisUrgency = 'can_wait' | 'daily_use' | 'unsure' | 'safety'

/** The kind of result the customer gets: a known cause, a safety case, or no match. */
export type DiagnosisVariant = 'known' | 'safety' | 'unknown'

export interface DiagnosisSymptom {
  readonly id: string
  readonly label: string
  readonly hint: string
  readonly likelyCause: string
  readonly safeStep: string
  readonly safety: DiagnosisSafety
  readonly safetyNote: string
  readonly requestSummary: string
  readonly prepTips: readonly string[]
}

export interface DiagnosisResult {
  readonly serviceId: ServiceId
  readonly symptom: DiagnosisSymptom
  readonly variant: DiagnosisVariant
  readonly urgency: DiagnosisUrgency
  readonly safety: DiagnosisSafety
  readonly safetyNote: string
  readonly safetyTitle: string
  readonly badgeLabel: string
  readonly title: string
  readonly nextStep: string
  readonly prepTips: readonly string[]
  readonly requestDescription: string
}

export interface RequestDraft {
  readonly description: string
}

/** The escape option every service shows: none of the listed symptoms match. */
export const NONE_OF_THESE_ID = 'none_of_these'

export const URGENCY_OPTIONS = [
  {
    value: 'can_wait',
    label: 'I can wait a few days',
    hint: 'Best for a problem that does not affect daily use.',
  },
  {
    value: 'daily_use',
    label: 'It affects daily use',
    hint: 'The shop should see it as soon as possible.',
  },
  {
    value: 'unsure',
    label: 'I am not sure it is safe to keep using',
    hint: 'Stop using it for now. A priority check is the safe choice when you are unsure.',
  },
  {
    value: 'safety',
    label: 'I am worried about safety',
    hint: 'For heat, smoke, sparks, or a swollen battery.',
  },
] as const satisfies readonly { value: DiagnosisUrgency; label: string; hint: string }[]

const SAFETY_ESCALATION =
  'Stop using the item if it feels unsafe and book a priority check. The shop will confirm the fault after inspection.'

const UNSURE_NOTE =
  'We cannot tell from this check whether it is safe to keep using. Stop using it for now and book a priority check so the shop can look at it.'

const URGENCY_SENTENCE: Record<DiagnosisUrgency, string> = {
  can_wait: 'I can wait a few days for the repair.',
  daily_use: 'This affects my daily use, so I would like the earliest available slot.',
  unsure: 'I am not sure whether it is safe to keep using it, so I would like a priority check.',
  safety: 'I am worried about safety and would like a priority check.',
}

/* ------------------------------------------------------------
   Symptoms
   Each one carries its own preparation tips, because the tips are
   the part of the checkup that is different from a plain request form.
   ------------------------------------------------------------ */
const SYMPTOMS: Record<ServiceId, readonly DiagnosisSymptom[]> = {
  phone: [
    {
      id: 'screen_cracked',
      label: 'Cracked or damaged screen',
      hint: 'Cracks, black patches, or touch that does not respond.',
      likelyCause: 'The glass or the display panel is damaged.',
      safeStep:
        'Keep the device away from water and avoid pressing on the cracked area. Back up your data if the screen still responds.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The phone screen is cracked or the display is damaged.',
      prepTips: [
        'Bring the charger and cable you normally use.',
        'Note whether the touch still works or only the picture is affected.',
        'Back up your photos if the screen still responds.',
      ],
    },
    {
      id: 'not_charging',
      label: 'Will not charge',
      hint: 'The cable is connected but the battery does not go up.',
      likelyCause: 'The charging port, cable, or battery may be faulty.',
      safeStep:
        'Try a known working cable and charger. Do not force the cable into the port or use a damaged cable.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The phone will not charge with a working cable and charger.',
      prepTips: [
        'Bring the charger and cable you normally use.',
        'Try another outlet and another cable before you come in.',
        'Note if it only charges when the cable is held at an angle.',
      ],
    },
    {
      id: 'battery_drains_fast',
      label: 'Battery drains fast',
      hint: 'The charge drops quickly, or the phone shuts down with battery left.',
      likelyCause: 'The battery may be worn out, or an app may be draining it.',
      safeStep:
        'Lower the screen brightness and close apps you do not need. Do not open the case yourself.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The phone battery drains much faster than it used to.',
      prepTips: [
        'Note how many hours the battery lasts and what you were using it for.',
        'Note the phone model and how long you have had it.',
        'Bring the charger you normally use.',
      ],
    },
    {
      id: 'swollen_battery',
      label: 'Battery looks swollen',
      hint: 'The back cover is lifting, or the screen is pushing out.',
      likelyCause: 'The battery has failed and may be unsafe.',
      safeStep:
        'Keep the device off and away from heat. Do not press the screen or puncture the battery.',
      safety: 'urgent',
      safetyNote:
        'A swollen battery can catch fire. Stop using the device and bring it to the shop as soon as possible.',
      requestSummary: 'The phone battery looks swollen and the screen or back cover may be lifting.',
      prepTips: [
        'Do not charge it on the way to the shop.',
        'Put the device in a non-flammable container if you have one.',
        'Tell the shop when you first noticed the back cover lifting.',
      ],
    },
    {
      id: 'water_damage',
      label: 'Water damage',
      hint: 'It got wet, or it was still wet when you switched it on.',
      likelyCause: 'Water may have reached the board or the battery.',
      safeStep:
        'Do not charge it and do not switch it on. Let it dry in the open and do not use heat to dry it.',
      safety: 'caution',
      safetyNote:
        'A wet phone can short out and the battery can fail. Do not charge it or switch it on until the shop has looked at it.',
      requestSummary: 'The phone got wet and may have water damage.',
      prepTips: [
        'Tell the shop how it got wet and for how long it was wet.',
        'Do not put it in rice or use a hairdryer.',
        'Bring it in a sealed bag so the wet parts stay separate from the rest of your things.',
      ],
    },
  ],
  computer: [
    {
      id: 'slow',
      label: 'Very slow',
      hint: 'It takes a long time to start or open apps.',
      likelyCause: 'The storage may be failing, or the system may be low on space or memory.',
      safeStep:
        'Back up important files and close apps you do not need. Do not open the case yourself.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The laptop or desktop is much slower than usual, even after a restart.',
      prepTips: [
        'Back up your important files before you come in.',
        'Note the model and the storage size of the machine.',
        'Note which programs are slow and which ones still work.',
      ],
    },
    {
      id: 'will_not_boot',
      label: 'Will not start',
      hint: 'No display, no startup sound, or it stops at a logo.',
      likelyCause: 'The power supply, storage, or startup files may have failed.',
      safeStep:
        'Check the power cable and outlet. Do not open the case. If you hear clicking or smell burning, unplug it.',
      safety: 'caution',
      safetyNote: 'If you hear clicking from the drive or smell burning, stop using it and unplug it.',
      requestSummary: 'The laptop or desktop will not start or show anything on the screen.',
      prepTips: [
        'Bring the power adapter and any cable you connect to it.',
        'Note whether there is a light, a fan noise, or any beep codes.',
        'Note what you were doing right before it stopped working.',
      ],
    },
    {
      id: 'overheating',
      label: 'Overheating',
      hint: 'The fan is loud, or the case gets very hot.',
      likelyCause: 'The vents may be blocked, or the cooling system may need service.',
      safeStep:
        'Keep it on a hard surface with clear vents. Back up your files and stop using it if it is too hot to touch.',
      safety: 'caution',
      safetyNote: 'Stop using it if it is too hot to touch or smells like burning. Do not open the case.',
      requestSummary: 'The laptop or desktop becomes very hot during normal use.',
      prepTips: [
        'Note how long it takes to get hot and what you were running.',
        'Bring it in the state you normally use it, so the shop can repeat the problem.',
        'Note the model and the room you use it in.',
      ],
    },
    {
      id: 'keyboard',
      label: 'Keyboard or buttons not working',
      hint: 'Keys stick, do not register, or a button is loose.',
      likelyCause: 'The keyboard, its cable, or the key switch may be faulty.',
      safeStep: 'Try an external keyboard if you have one. Do not open the case yourself.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'Some keys or buttons on the computer do not work.',
      prepTips: [
        'Note which keys do not work, and whether they ever worked.',
        'Bring the computer so the shop can test it.',
        'Note if it still works with an external keyboard.',
      ],
    },
    {
      id: 'upgrade',
      label: 'Needs more storage or memory',
      hint: 'It is full, slow, or cannot hold the files you need.',
      likelyCause: 'The storage may be full, failing, or too small for what you run.',
      safeStep:
        'Save your files to an external drive or cloud storage before you come in. Do not buy parts yourself yet.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The computer needs more storage or memory.',
      prepTips: [
        'Note how much storage you use now and how much you need.',
        'Bring the computer so the shop can check what fits.',
        'Back up your files first, a new drive may need a fresh setup.',
      ],
    },
  ],
  appliance: [
    {
      id: 'not_cooling',
      label: 'Not cooling',
      hint: 'The air conditioner or refrigerator runs but stays warm.',
      likelyCause: 'The filter, fan, or cooling system may need service.',
      safeStep:
        'Clean the accessible filter if the manual allows it. Keep the area around the unit clear.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The appliance runs but does not cool properly.',
      prepTips: [
        'Note the model number and how old the unit is.',
        'Note whether the fan still runs when it does not cool.',
        'Note the room and the thermostat setting you use.',
      ],
    },
    {
      id: 'leaking',
      label: 'Leaking water',
      hint: 'Water appears under or around the unit.',
      likelyCause: 'A hose, seal, or drain line may be blocked or damaged.',
      safeStep: 'Unplug the unit and turn off the water supply if you can do so safely. Do not use it until it is checked.',
      safety: 'caution',
      safetyNote:
        'Water and electricity are unsafe together. Unplug the unit and turn off the water supply if you can do so safely.',
      requestSummary: 'The appliance is leaking water during use.',
      prepTips: [
        'Note where the water comes from and when it starts.',
        'Note the model number and the age of the unit.',
        'Keep the area dry until the shop checks it.',
      ],
    },
    {
      id: 'will_not_start',
      label: 'Will not start',
      hint: 'No power, no response, or it stops by itself.',
      likelyCause: 'The power supply, control board, or a safety switch may be faulty.',
      safeStep: 'Check that the plug and outlet are working. Do not open the unit.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The appliance will not start or turns off by itself.',
      prepTips: [
        'Note the model number and any error code or beep.',
        'Note whether the outlet and the plug work.',
        'Note when it last worked normally.',
      ],
    },
  ],
  tv_audio: [
    {
      id: 'no_picture',
      label: 'No picture',
      hint: 'The screen stays black but the TV has power.',
      likelyCause: 'The display panel, backlight, or video input may be faulty.',
      safeStep: 'Check the input source and cables. Do not open the TV or press on the screen.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The TV screen stays black even though the TV has power.',
      prepTips: [
        'Bring the remote and the power cable.',
        'Note which input fails and which ones still work.',
        'Note the model and the size of the screen.',
      ],
    },
    {
      id: 'no_sound',
      label: 'No sound',
      hint: 'The picture works but there is no audio.',
      likelyCause: 'The speaker, audio settings, or sound board may be faulty.',
      safeStep: 'Check the volume and mute settings, then try another input. Do not open the TV.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The TV has a picture but no sound.',
      prepTips: [
        'Bring the remote and the power cable.',
        'Note which input has no sound and which ones work.',
        'Try another input before you come in and note the result.',
      ],
    },
    {
      id: 'crackling_sound',
      label: 'Speaker crackles or distorts',
      hint: 'The sound breaks up, buzzes, or rattles.',
      likelyCause: 'The speaker, the cable, or the sound setting may be faulty.',
      safeStep: 'Lower the volume before you play it again. Do not open the speaker.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The speaker crackles or distorts the sound.',
      prepTips: [
        'Note which speaker crackles and whether it happens on every input.',
        'Bring the cables you connect it with.',
        'Note if the crackle gets worse when the volume goes up.',
      ],
    },
    {
      id: 'remote',
      label: 'Remote not working',
      hint: 'New batteries do not fix it.',
      likelyCause: 'The remote, its sensor, or the pairing may be faulty.',
      safeStep: 'Try new batteries and point the remote directly at the TV. Check the manual for pairing steps.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The TV remote does not respond even with new batteries.',
      prepTips: [
        'Bring the remote and the batteries you used.',
        'Note the model of the TV or sound bar.',
        'Note whether the device still works in its app.',
      ],
    },
  ],
  electrical: [
    {
      id: 'sparking',
      label: 'Outlet sparked',
      hint: 'A spark, popping sound, or burning smell came from an outlet.',
      likelyCause: 'The outlet or wiring may be loose or damaged.',
      safeStep:
        'Stop using the outlet and switch off the breaker if you can do so safely. Do not open the outlet or panel yourself.',
      safety: 'urgent',
      safetyNote:
        'Sparks and burning smells can start a fire. Stop using the outlet and book a priority check.',
      requestSummary: 'An outlet sparked or made a popping sound when I plugged something in.',
      prepTips: [
        'Stop using that outlet until the shop checks it.',
        'Note which outlet it was and what you plugged in.',
        'Note when it started and whether it happens with more than one device.',
      ],
    },
    {
      id: 'breaker',
      label: 'Breaker keeps tripping',
      hint: 'Power cuts out when you use a certain outlet or appliance.',
      likelyCause: 'The circuit may be overloaded, or an appliance may have a fault.',
      safeStep: 'Unplug the appliance on that circuit and do not keep resetting the breaker. Do not open the panel yourself.',
      safety: 'caution',
      safetyNote: 'If the breaker will not stay on, book a priority check. Do not open the panel yourself.',
      requestSummary: 'The breaker trips when I use a certain outlet or appliance.',
      prepTips: [
        'Note which devices you were using when it tripped.',
        'Do not keep resetting the breaker before the shop arrives.',
        'Note how often it trips and which room it affects.',
      ],
    },
    {
      id: 'flicker',
      label: 'Lights flicker',
      hint: 'Lights dim or flicker when an appliance turns on.',
      likelyCause: 'The circuit may be overloaded, or a connection may be loose.',
      safeStep: 'Turn off the appliance on that circuit and do not open the outlet or panel yourself.',
      safety: 'caution',
      safetyNote:
        'If lights flicker across the whole home or you smell burning, stop using the circuit and book a priority check.',
      requestSummary: 'The lights flicker or dim when an appliance turns on.',
      prepTips: [
        'Note which lights flicker and when.',
        'Note which appliance causes it.',
        'Note if it affects more than one room.',
      ],
    },
  ],
  other: [
    {
      id: 'noise',
      label: 'Unusual noise',
      hint: 'A grinding, rattling, or buzzing sound.',
      likelyCause: 'A moving part or connection may be loose or worn.',
      safeStep: 'Stop using the item if the noise is loud or comes with a burning smell. Do not open it yourself.',
      safety: 'standard',
      safetyNote: '',
      requestSummary: 'The item makes an unusual noise during use.',
      prepTips: [
        'Record the noise on your phone if you can.',
        'Note which part makes the sound and when it happens.',
        'Note the model number and the age of the item.',
      ],
    },
    {
      id: 'physical_damage',
      label: 'Physical damage',
      hint: 'A crack, dent, or broken part.',
      likelyCause: 'The damaged part may affect safety or performance.',
      safeStep: 'Stop using the item if it feels unstable or exposes wires.',
      safety: 'caution',
      safetyNote: 'Do not try to repair it yourself. The shop will check whether it is safe to use.',
      requestSummary: 'The item has physical damage and may not be safe to use.',
      prepTips: [
        'Take clear photos of the damage.',
        'Note how the damage happened and when.',
        'Do not try to fix it yourself before you come in.',
      ],
    },
  ],
}

/** The result shown when none of the listed symptoms match. */
function unknownSymptom(): DiagnosisSymptom {
  return {
    id: NONE_OF_THESE_ID,
    label: 'Not sure what is wrong',
    hint: 'None of these match. Describe it and the shop will check it.',
    likelyCause: 'The shop needs to look at the item to identify the fault.',
    safeStep:
      'Stop using it if it feels hot, swollen, or smells of burning. Do not open it yourself.',
    safety: 'standard',
    safetyNote: '',
    requestSummary: 'I am not sure what is wrong. Here is what I see and when it started.',
    prepTips: [
      'Take clear photos of the problem.',
      'Note when the problem started and what changed.',
      'Note anything you already tried.',
    ],
  }
}

export function getSymptoms(serviceId: ServiceId): readonly DiagnosisSymptom[] {
  return SYMPTOMS[serviceId]
}

export function findSymptom(serviceId: ServiceId, symptomId: string | null): DiagnosisSymptom | null {
  if (symptomId === null) return null
  if (symptomId === NONE_OF_THESE_ID) return unknownSymptom()
  return getSymptoms(serviceId).find((symptom) => symptom.id === symptomId) ?? null
}

export function parseUrgency(value: unknown): DiagnosisUrgency | null {
  if (
    value === 'can_wait' ||
    value === 'daily_use' ||
    value === 'unsure' ||
    value === 'safety'
  ) {
    return value
  }
  return null
}

/* ------------------------------------------------------------
   Safety rules
   The symptom level and the urgency level are combined by rank, so a
   known urgent symptom can never be softened by a calm urgency answer.
   ------------------------------------------------------------ */
const SAFETY_RANK: Record<DiagnosisSafety, number> = { standard: 0, caution: 1, urgent: 2 }

function higherSafety(a: DiagnosisSafety, b: DiagnosisSafety): DiagnosisSafety {
  return SAFETY_RANK[a] >= SAFETY_RANK[b] ? a : b
}

function safetyFor(urgency: DiagnosisUrgency, symptom: DiagnosisSymptom): DiagnosisSafety {
  const fromUrgency: DiagnosisSafety =
    urgency === 'safety' ? 'urgent' : urgency === 'unsure' ? 'caution' : 'standard'
  return higherSafety(fromUrgency, symptom.safety)
}

function safetyNoteFor(
  symptom: DiagnosisSymptom,
  urgency: DiagnosisUrgency,
  safety: DiagnosisSafety,
): string {
  if (safety === 'standard') return ''
  if (urgency === 'unsure') {
    return symptom.safetyNote.length > 0 ? `${symptom.safetyNote} ${UNSURE_NOTE}` : UNSURE_NOTE
  }
  if (symptom.safetyNote.length > 0) return symptom.safetyNote
  return SAFETY_ESCALATION
}

function safetyTitleFor(urgency: DiagnosisUrgency, safety: DiagnosisSafety): string {
  if (safety === 'urgent') return 'Stop and get this checked'
  if (urgency === 'unsure') return 'Stop using it until it is checked'
  return 'Use it with care'
}

function nextStepFor(urgency: DiagnosisUrgency, safety: DiagnosisSafety): string {
  if (safety === 'urgent') return 'Book a priority check before using the item again.'
  if (urgency === 'unsure') {
    return 'Book a priority check so the shop can confirm whether it is safe to use.'
  }
  if (urgency === 'daily_use') return 'Book the earliest available slot.'
  return 'Book a slot that fits your schedule.'
}

function variantFor(symptomId: string, safety: DiagnosisSafety): DiagnosisVariant {
  if (symptomId === NONE_OF_THESE_ID) return 'unknown'
  return safety === 'urgent' ? 'safety' : 'known'
}

const BADGE_LABEL: Record<DiagnosisVariant, string> = {
  safety: 'Safety check recommended',
  known: 'Likely issue',
  unknown: 'Needs more detail',
}

export function diagnose(
  serviceId: ServiceId,
  symptomId: string | null,
  urgency: DiagnosisUrgency | null,
): DiagnosisResult | null {
  const symptom = findSymptom(serviceId, symptomId)
  if (symptom === null || urgency === null) return null

  const safety = safetyFor(urgency, symptom)
  const variant = variantFor(symptom.id, safety)
  return {
    serviceId,
    symptom,
    variant,
    urgency,
    safety,
    safetyNote: safetyNoteFor(symptom, urgency, safety),
    safetyTitle: safetyTitleFor(urgency, safety),
    badgeLabel: BADGE_LABEL[variant],
    title: variant === 'unknown' ? 'We cannot tell from this check' : symptom.label,
    nextStep: nextStepFor(urgency, safety),
    prepTips: symptom.prepTips,
    requestDescription: `${symptom.requestSummary} ${URGENCY_SENTENCE[urgency]}`,
  }
}

export function buildRequestDraft(
  serviceId: ServiceId,
  symptomId: string | null,
  urgency: DiagnosisUrgency | null,
): RequestDraft | null {
  const result = diagnose(serviceId, symptomId, urgency)
  if (result === null) return null
  return { description: result.requestDescription }
}

export function requestHref(
  serviceId: ServiceId,
  symptomId: string,
  urgency: DiagnosisUrgency,
): string {
  const params = new URLSearchParams({ service: serviceId, issue: symptomId, urgency })
  return `/request/new?${params.toString()}`
}

/** Restores a completed quick check, including the result step. */
export function diagnosisHref(
  serviceId: ServiceId,
  symptomId: string,
  urgency: DiagnosisUrgency,
): string {
  const params = new URLSearchParams({ service: serviceId, issue: symptomId, urgency })
  return `/diagnose?${params.toString()}`
}
