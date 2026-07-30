// The REAL 3D cloud D (batch 9). Not an image with a CSS rotateY — Nick called that out
// correctly five times: a flat plane "rotating" reads as a squeeze, because it has no sides.
// This is an actual GLB mesh, lifted FROM THE LOGO'S OWN primary-font cloud D on Higgsfield
// (image_to_3d, textured), rendered in WebGL and turned around its Y axis by the scroll —
// with true silhouette change, self-occlusion and parallax, because it genuinely has depth.
//
// Engineering constraints honoured:
//   · three.js is loaded LAZILY (dynamic import) when the section approaches, so the main
//     bundle does not grow; the ~MB-scale GLB is fetched the same way
//   · render-on-demand: one frame per rotation change, no rAF loop burning idle frames
//   · WebGL failure, load failure and reduced motion all fall back to the still render
import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'

export default function CloudD3D({
  rot,
  reduced,
  className = '',
}: {
  /** rotation around Y in radians — driven by the world's one scroll value */
  rot: MotionValue<number>
  reduced: boolean
  className?: string
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (reduced) return // the fallback still is the reduced-motion experience
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let cleanup: (() => void) | null = null

    // arm only when the section is within 1.5 viewports — the visitor never waits for it
    const io = new IntersectionObserver(
      async entries => {
        if (!entries.some(e => e.isIntersecting) || disposed || cleanup) return
        io.disconnect()
        try {
          const [THREE, { GLTFLoader }] = await Promise.all([
            import('three'),
            import('three/examples/jsm/loaders/GLTFLoader.js'),
          ])
          if (disposed) return

          const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          renderer.outputColorSpace = THREE.SRGBColorSpace
          host.appendChild(renderer.domElement)
          renderer.domElement.style.width = '100%'
          renderer.domElement.style.height = '100%'
          renderer.domElement.style.display = 'block'

          const scene = new THREE.Scene()
          const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
          camera.position.set(0, 0, 4.6)

          // daylight to match the sky: warm key from the upper left, cool fill, soft ambient
          scene.add(new THREE.HemisphereLight(0xffffff, 0xbcd8f2, 1.15))
          const key = new THREE.DirectionalLight(0xfff6e8, 1.35)
          key.position.set(-2.2, 2.6, 3.2)
          scene.add(key)
          const rim = new THREE.DirectionalLight(0xdcebf8, 0.5)
          rim.position.set(2.4, -1.2, -2.4)
          scene.add(rim)

          const group = new THREE.Group()
          scene.add(group)

          const render = () => { if (!disposed) renderer.render(scene, camera) }

          const size = () => {
            const w = host.clientWidth || 300
            const h = host.clientHeight || w * 1.16
            renderer.setSize(w, h, false)
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            render()
          }

          new GLTFLoader().load(
            '/media/brand/cloud-d.glb',
            gltf => {
              if (disposed) return
              const obj = gltf.scene
              // centre the mesh and scale it to a known height so the CSS box rules layout
              const box = new THREE.Box3().setFromObject(obj)
              const c = box.getCenter(new THREE.Vector3())
              const s = box.getSize(new THREE.Vector3())
              obj.position.sub(c)
              const scale = 2.35 / Math.max(s.x, s.y)
              obj.scale.setScalar(scale)
              group.add(obj)
              group.rotation.y = rot.get()
              size()
            },
            undefined,
            () => setFailed(true),
          )

          const unsub = rot.on('change', v => {
            group.rotation.y = v
            render() // on demand — no loop
          })
          const ro = new ResizeObserver(size)
          ro.observe(host)

          cleanup = () => {
            unsub()
            ro.disconnect()
            renderer.dispose()
            renderer.domElement.remove()
          }
        } catch {
          setFailed(true)
        }
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(host)

    return () => {
      disposed = true
      io.disconnect()
      cleanup?.()
    }
  }, [reduced, rot])

  if (reduced || failed) {
    return (
      <img
        src="/media/brand/cloud-d-3d.webp"
        alt=""
        aria-hidden
        className={`block h-auto w-full select-none ${className}`}
      />
    )
  }

  return <div ref={hostRef} className={`aspect-[822/1000] w-full ${className}`} aria-hidden />
}
