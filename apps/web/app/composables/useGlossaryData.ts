export interface GlossaryTerm {
  id: string
  letter: string
  letterSlug: string
  slug: string
  title: string
}

export interface GlossaryGroup {
  letter: string
  slug: string
  terms: GlossaryTerm[]
}

export const glossaryLetters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#']

const placeholderTerms = [
  'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  'Quisque faucibus ex sapien',
  'Tempus leo eu aenean',
  'Pulvinar vivamus fringilla lacus',
  'Iaculis massa nisl malesuada',
  'Ad litora torquent per conubia',
  'Ut hendrerit semper vel class',
]

const seaFreightTerms = [
  'Sea Freight',
  'Sea Freight FCL (Full Container Load)',
  'Sea Freight LCL (Less Container Load)',
  'Tarif dan estimasi Sea Freight',
]

const airFreightTerms = [
  'Air Freight',
  'Berat volumetrik Air Freight',
  'Tarif pengiriman Air Freight',
  'Estimasi waktu Air Freight',
]

const seaFreightLetters = new Set(['A', 'B', 'C', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'V', 'W', 'Z'])
const airFreightLetters = new Set(['D', 'E', 'F', 'G', 'H', 'I', 'S', 'T', 'U'])

function letterSlug(letter: string) {
  return letter === '#' ? 'other' : letter.toLowerCase()
}

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function termTitlesForLetter(letter: string) {
  const terms: string[] = []

  if (seaFreightLetters.has(letter))
    terms.push(...seaFreightTerms)

  if (airFreightLetters.has(letter))
    terms.push(...airFreightTerms)

  while (terms.length < 18)
    terms.push(...placeholderTerms)

  return terms.slice(0, 18)
}

function termsForLetter(letter: string): GlossaryTerm[] {
  const usedSlugs = new Map<string, number>()
  const currentLetterSlug = letterSlug(letter)

  return termTitlesForLetter(letter).map((title, index) => {
    const baseSlug = slugify(title) || `term-${index + 1}`
    const occurrence = (usedSlugs.get(baseSlug) ?? 0) + 1
    usedSlugs.set(baseSlug, occurrence)

    return {
      id: `${currentLetterSlug}-${index + 1}`,
      letter,
      letterSlug: currentLetterSlug,
      slug: occurrence === 1 ? baseSlug : `${baseSlug}-${occurrence}`,
      title,
    }
  })
}

const allGlossaryGroups: GlossaryGroup[] = glossaryLetters.map(letter => ({
  letter,
  slug: letterSlug(letter),
  terms: termsForLetter(letter),
}))

const glossaryGroups: GlossaryGroup[] = allGlossaryGroups.map(group => ({
  ...group,
  terms: group.terms.slice(0, 8),
}))

export function getGlossaryGroup(slug: string) {
  return allGlossaryGroups.find(group => group.slug === slug.toLowerCase())
}

export function getGlossaryTerm(letter: string, slug: string) {
  return getGlossaryGroup(letter)?.terms.find(term => term.slug === slug.toLowerCase())
}

export function glossaryLetterPath(letter: string) {
  return `/glossary/${letterSlug(letter)}`
}

export function glossaryTermPath(term: GlossaryTerm) {
  return `/glossary/${term.letterSlug}/${term.slug}`
}

export function useGlossaryData() {
  return {
    glossaryGroups,
    letters: glossaryLetters,
  }
}
