// Početna — ONE CONTINUOUS DESCENT (Nick's directive): a single world spans hero → footer,
// one scroll progress drives every layer, no content section owns a background, and every
// junction is crossed by a masked layer or a gradient bridge — never abutted.
// Galaxy Home structure kept exactly; only the assets and the Serbian content are ours.
// (Stage 6 moved this page out of App.tsx unchanged — App is now the router shell.)
import { World, WorldLayer, SeamBridge, Beat } from '../components/World'
import Hero from '../components/sections/Hero'
import Radovi from '../components/sections/Radovi'
import NaseUsluge from '../components/sections/NaseUsluge'
import Opis from '../components/sections/Opis'
import TextFill from '../components/sections/TextFill'
import Marquee from '../components/sections/Marquee'
import Stats from '../components/sections/Stats'
import Zavrsnica from '../components/sections/Zavrsnica'
import Footer from '../components/Footer'
import { usePageMeta } from '../lib/meta'
import { HOME_SCHEMA } from '../lib/schema'

const MASK = {
  sky: 'linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)',
  flourish: 'linear-gradient(to bottom, transparent 4%, black 34%, black 66%, transparent 96%)',
  tower: 'linear-gradient(to bottom, transparent 0%, black 7%, black 52%, transparent 100%)',
  // batch 9 — Nick's red line, as a mask: the warm zone's top edge is an IRREGULAR wavy
  // cloud-line (±45px undulations, drawn from his sketch), blurred 24px so no row of pixels
  // ever carries a hard step. preserveAspectRatio=none stretches it across any viewport.
  wavy: `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 1000' preserveAspectRatio='none'>` +
    `<defs>` +
    `<linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>` +
    `<stop offset='0' stop-color='white'/><stop offset='0.55' stop-color='white'/>` +
    `<stop offset='0.98' stop-color='white' stop-opacity='0'/>` +
    `</linearGradient>` +
    `<filter id='b' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='24'/></filter>` +
    `</defs>` +
    `<path filter='url(%23b)' fill='url(%23g)' d='M0,210 C90,168 170,232 290,206 C420,178 470,252 590,240 ` +
    `C700,232 760,178 870,196 C980,214 1030,148 1150,164 C1260,178 1350,118 1440,140 L1440,1000 L0,1000 Z'/>` +
    `</svg>`,
  )}")`,
  sea: 'linear-gradient(to bottom, transparent 0%, black 46%, black 78%, transparent 100%)',
  rays: 'linear-gradient(to bottom, transparent 0%, black 26%, black 64%, transparent 100%)',
  // the ground plates fade IN at the top only — never out at the bottom, they are the end
  plain: 'linear-gradient(to bottom, transparent 0%, black 38%, black 100%)',
  paper: 'linear-gradient(to bottom, transparent 0%, black 42%, black 100%)',
}

export default function Pocetna() {
  usePageMeta({
    title: 'DreamSign — Izrada sajtova koji prodaju | Srbija',
    description:
      'Pretvaramo vaše poslovne snove u realnost — sajtovi koji posetioce pretvaraju u kupce. Ugovor, garancije, transparentnost. Pišite nam na WhatsApp.',
    path: '/',
    ogTitle: 'DreamSign — Izrada sajtova koji prodaju',
    ogDescription: 'Mi pretvaramo vaše poslovne snove u realnost, a na vama je da potpisujete ugovore.',
    ogImageAlt: 'DreamSign — oblaci iznad kojih snovi postaju realnost.',
    schema: HOME_SCHEMA,
  })

  return (
    <main>
      <World>
        <Hero />

        {/* THE DESCENT — overlaps the hero by 25vh; nothing below here paints its own ground. */}
        <div className="pointer-events-none relative z-20 -mt-[25vh]">
          {/* junction 1: the gradient bridge, starting on the hero's sampled bottom colour */}
          <SeamBridge className="top-[8vh] h-[86vh]" />

          <div className="pt-24 sm:pt-32 md:pt-40">
            {/* batch 5, Nick's order — the proof lands right under the hero: past work +
                the trust facts, on B3's quiet sky (small clouds, no mass — the cards are
                the mass). The layer straddles both junctions per the one-descent law. */}
            <Beat name="radovi" layers={
              <WorldLayer
                src="/media/B3-square-sky.webp"
                box="-top-[34vh] -bottom-[40vh]"
                imgClass="absolute inset-0 h-[126%] w-full object-cover object-center"
                y={['0%', '-10%']} base={0.85} mask={MASK.sky}
              />
            }>
              <Radovi />
            </Beat>

            {/* what we sell — the quill flourish rides the right margin, a whisper;
                batch 8 adds two ambient puffs drifting behind the giant word-line so the
                section lives in weather, not on a flat wall */}
            <Beat name="usluge" layers={
              <>
                <WorldLayer
                  src="/media/B2-vertical-flourish.webp"
                  box="-top-[26vh] -bottom-[30vh]"
                  imgClass="absolute right-[-14%] top-0 h-full w-auto max-w-none object-contain md:right-[-6%]"
                  y={['0%', '-7%']} mask={MASK.flourish}
                  opacity={{ range: [0.10, 0.22, 0.40], values: [0, 0.32, 0.10] }}
                />
                {/* batch 24 (owner): THE cloud — the realistic cumulus he circled in the
                    beat above, now living through the descent; parallax kept everywhere */}
                <WorldLayer
                  src="/media/cloud-real.webp" eager
                  box="-top-[6vh] -bottom-[10vh]"
                  imgClass="absolute left-[-12%] top-[6%] w-[44%] h-auto max-w-none"
                  y={['0%', '-14%']} base={0.9} float={{ px: 9, sec: 9 }}
                />
                <WorldLayer
                  src="/media/cloud-real.webp" eager
                  box="-top-[6vh] -bottom-[10vh]"
                  imgClass="absolute right-[-10%] top-[46%] w-[38%] h-auto max-w-none scale-x-[-1]"
                  y={['0%', '-8%']} base={0.8} float={{ px: 7, sec: 11, delay: 1.6 }}
                />
                {/* batch 10 — the storybook cloud Nick red-circled into the empty left
                    field beside rows 03/04 */}
                <WorldLayer
                  src="/media/hero-cloud-foreground.webp"
                  box="-top-[4vh] -bottom-[6vh]"
                  imgClass="absolute left-[-7%] top-[81%] w-[36%] h-auto max-w-none"
                  y={['0%', '-11%']} base={0.92} float={{ px: 10, sec: 8, delay: 0.7 }}
                />
              </>
            }>
              <NaseUsluge />
            </Beat>

            {/* the mountain: one instance, its TOP edge cut by MASK.wavy — an irregular,
                blurred cloud-line silhouette drawn to Nick's red-line sketch (batch 9):
                high left, dipping, rising, dipping deeper, climbing off the right edge.
                Never a horizontal fade. The batch-8 outlined bank he circled is deleted. */}
            <Beat name="opis" layers={
              <WorldLayer
                src="/media/B4-tower-fade.webp" eager
                box="-top-[38vh] -bottom-[58vh]"
                imgClass="absolute inset-0 h-[115%] w-full object-cover object-top"
                y={['0%', '-20%']} mask={MASK.wavy}
              />
            }>
              <Opis />
            </Beat>

            {/* the vertical sea: one continuous span straddling both junctions around the promise */}
            <Beat name="promise" layers={
              <WorldLayer
                src="/media/B7-vertical-sea.webp"
                box="-top-[44vh] -bottom-[56vh]"
                imgClass="absolute inset-0 h-[130%] w-full object-cover object-center"
                y={['0%', '-12%']} base={0.92} mask={MASK.sea}
              />
            }>
              <TextFill />
            </Beat>

            {/* the light gap opening into the proof beat */}
            <Beat name="marquee" layers={
              <WorldLayer
                src="/media/B6-light-rays.webp"
                box="-top-[30vh] -bottom-[64vh]"
                imgClass="absolute inset-0 h-[130%] w-full object-cover object-center"
                y={['0%', '-8%']} mask={MASK.rays}
                // batch 5: two beats were inserted above — every world-fraction window
                // slides later or the light arrives during the wrong beat
                opacity={{ range: [0.56, 0.71, 0.86], values: [0, 0.62, 0.12] }}
              />
            }>
              <Marquee />
            </Beat>

            <Beat name="stats" layers={
              <WorldLayer
                src="/media/cloud-real.webp" eager
                box="-top-[10vh] -bottom-[10vh]"
                imgClass="absolute right-[-8%] top-[4%] w-[32%] h-auto max-w-none scale-x-[-1]"
                y={['0%', '-10%']} base={0.7}
              />
            }><Stats /></Beat>
          </div>

          {/* THE GROUND — the signature beat and the footer stand on the same plain:
              one set of layers spans both, so the page ends inside the world, not beside it. */}
          <div className="relative">
            <div
              className="absolute left-0 right-0 -top-[80vh] bottom-0 z-0 pointer-events-none
                         bg-gradient-to-b from-transparent via-white/45 to-white/80"
              aria-hidden
            />
            <WorldLayer
              src="/media/B8-paper-ground.webp"
              box="-top-[30vh] bottom-0"
              imgClass="absolute inset-0 h-[112%] w-full object-cover object-bottom"
              y={['0%', '-4%']} mask={MASK.paper}
              opacity={{ range: [0.70, 0.82, 1], values: [0, 0.7, 0.7] }}
            />
            {/* the plain: once it is up it stays up, at full opacity, through the footer */}
            <WorldLayer
              src="/media/landing-plain.webp"
              box="-top-[42vh] bottom-0"
              imgClass="absolute inset-0 h-[118%] w-full object-cover object-bottom"
              y={['0%', '-6%']} mask={MASK.plain}
              opacity={{ range: [0.64, 0.80, 1], values: [0, 1, 1] }}
            />
            <div className="pointer-events-auto relative z-10">
              <Beat name="finale"><Zavrsnica /></Beat>
              <Footer />
            </div>
          </div>
        </div>
      </World>
    </main>
  )
}
