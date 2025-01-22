"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

interface CrateVisualizerProps {
  width: number
  height: number
  depth: number
}

export function CrateVisualizer({ width, height, depth }: CrateVisualizerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  // Convert dimensions to meters
  const widthMeters = width 
  const heightMeters = height 
  const depthMeters = depth 

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0) // Light gray background

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    )

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Load wood texture
    const textureLoader = new THREE.TextureLoader()
    const woodTexture = textureLoader.load('/wood-texture.png')
    const normalMap = textureLoader.load('/wood-normal.jpg')
    
    // Configure texture repeat based on dimensions
    const repeatX = Math.max(1, width / 2)
    const repeatY = Math.max(1, height / 2)
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping
    woodTexture.repeat.set(repeatX, repeatY)
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
    normalMap.repeat.set(repeatX, repeatY)

    const geometry = new THREE.BoxGeometry(widthMeters, heightMeters, depthMeters)
    const material = new THREE.MeshPhysicalMaterial({ 
        map: woodTexture,
        normalMap: normalMap,
        color: 0xd4b792,
        metalness: 0,
        roughness: 0.8,
        bumpScale: 0.1,
        envMapIntensity: 1,
    })
    const cube = new THREE.Mesh(geometry, material)
    
    // Add subtle edge beveling
    const edgeGeometry = new THREE.EdgesGeometry(geometry)
    const edgeMaterial = new THREE.LineBasicMaterial({ 
        color: 0x3a2512,
        linewidth: 1,
    })
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
    cube.add(edges)
    
    scene.add(cube)

    // Adjust lighting for better wood appearance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xfff2e6, 1, 100)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(-5, 5, -5)
    scene.add(directionalLight)

    camera.position.z = Math.max(widthMeters, heightMeters, depthMeters) * 2

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [width, height, depth,])

  return <div ref={mountRef} className="h-[400px] w-full" />
}

