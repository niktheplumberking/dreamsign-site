// The world-layer masks, shared by the inner pages (Pocetna carries its approved originals
// inline). Values identical to the homepage — one dissolve vocabulary for the whole site.
export const MASK = {
  sky: 'linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)',
  flourish: 'linear-gradient(to bottom, transparent 4%, black 34%, black 66%, transparent 96%)',
  sea: 'linear-gradient(to bottom, transparent 0%, black 46%, black 78%, transparent 100%)',
  rays: 'linear-gradient(to bottom, transparent 0%, black 26%, black 64%, transparent 100%)',
  // the ground plates fade IN at the top only — never out at the bottom, they are the end
  plain: 'linear-gradient(to bottom, transparent 0%, black 38%, black 100%)',
  paper: 'linear-gradient(to bottom, transparent 0%, black 42%, black 100%)',
} as const
