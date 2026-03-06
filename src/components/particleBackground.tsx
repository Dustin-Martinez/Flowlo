import { useEffect, useRef } from "react"

declare global {
  interface Window {
    VANTA?: any
    THREE?: any
  }
}

const VantaGlobe = () => {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    // Load THREE.js
    const threeScript = document.createElement("script")
    threeScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
    threeScript.async = true

    // Load Vanta Globe
    const vantaScript = document.createElement("script")
    vantaScript.src =
      "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"
    vantaScript.async = true

    threeScript.onload = () => {
      document.body.appendChild(vantaScript)
    }

    vantaScript.onload = () => {
      if (!vantaEffect.current && window.VANTA && vantaRef.current) {
        vantaEffect.current = window.VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: 0x90645A,       // Rich chocolate brown
  color2: 0xDCAE96,      // Light beige/cream
  backgroundColor: 0xF5F5DC
        })
      }
    }

    document.body.appendChild(threeScript)

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  return (
    <div
      ref={vantaRef}
      style={{ width: "100%", height: "100vh" }}
    />
  )
}

export default VantaGlobe
