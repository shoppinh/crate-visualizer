"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

export interface OrderFormData {
  name: string
  businessName: string
  deliveryAddress: string
  width: number
  height: number
  depth: number
  quantity: number
  weight: number
  dateRequired: string
}

interface OrderFormProps {
  onSubmit: (
    data: OrderFormData
  ) => void
  onDimensionsChange: React.Dispatch<React.SetStateAction<{
    width: number;
    height: number;
    depth: number;
  }>>
  dimensions: { width: number, height: number, depth: number }
}

interface DimensionLimits {
  maxWidth: number;
  maxHeight: number;
  maxDepth: number;
}

export function OrderForm({ onSubmit, onDimensionsChange }: OrderFormProps) {
  const [name, setName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [width, setWidth] = useState(1000)
  const [height, setHeight] = useState(1000)
  const [depth, setDepth] = useState(1000)
  const [quantity, setQuantity] = useState(1)
  const [weight, setWeight] = useState(1)
  const [dateRequired, setDateRequired] = useState("")

  // Update validation error state to handle multiple errors
  const [validationErrors, setValidationErrors] = useState<{
    width: string | null;
    height: string | null;
    depth: string | null;
  }>({
    width: null,
    height: null,
    depth: null,
  })

  // Calculate dimension limits based on current inputs
  const calculateDimensionLimits = (
    currentWidth: number,
    currentHeight: number,
    currentDepth: number,
    changingDimension: 'width' | 'height' | 'depth'
  ): DimensionLimits => {
    let maxWidth = 2400
    let maxHeight = 2400
    let maxDepth = 2400

    // Helper function to check if a dimension is >= 1200
    const isLarge = (value: number) => value >= 1200

    switch (changingDimension) {
      case 'width':
        if (isLarge(currentWidth)) {
          maxHeight = 1200
          maxDepth = 1200
        }
        break
      case 'height':
        if (isLarge(currentHeight)) {
          maxWidth = 1200
          maxDepth = 1200
        }
        break
      case 'depth':
        if (isLarge(currentDepth)) {
          maxWidth = 1200
          maxHeight = 1200
        }
        break
    }

    // If any dimension is large, limit others to 1200
    if (isLarge(currentWidth) || isLarge(currentHeight) || isLarge(currentDepth)) {
      maxWidth = Math.min(maxWidth, isLarge(currentWidth) ? 2400 : 1200)
      maxHeight = Math.min(maxHeight, isLarge(currentHeight) ? 2400 : 1200)
      maxDepth = Math.min(maxDepth, isLarge(currentDepth) ? 2400 : 1200)
    }

    return { maxWidth, maxHeight, maxDepth }
  }

  // Update validation function to set specific error
  const validateAndUpdateDimension = (
    value: number,
    dimension: 'width' | 'height' | 'depth'
  ) => {
    const limits = calculateDimensionLimits(
      dimension === 'width' ? value : width,
      dimension === 'height' ? value : height,
      dimension === 'depth' ? value : depth,
      dimension
    )

    let isValid = true
    let errorMessage = null

    if (dimension === 'width' && value > limits.maxWidth) {
      isValid = false
      errorMessage = `Width cannot exceed ${limits.maxWidth}mm with current dimensions`
    } else if (dimension === 'height' && value > limits.maxHeight) {
      isValid = false
      errorMessage = `Height cannot exceed ${limits.maxHeight}mm with current dimensions`
    } else if (dimension === 'depth' && value > limits.maxDepth) {
      isValid = false
      errorMessage = `Depth cannot exceed ${limits.maxDepth}mm with current dimensions`
    }

    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [dimension]: errorMessage
    }))

    // Update dimension if valid
    if (isValid) {
      switch (dimension) {
        case 'width':
          setWidth(value)
          break
        case 'height':
          setHeight(value)
          break
        case 'depth':
          setDepth(value)
          break
      }
    }
  }

  useEffect(() => {
    onDimensionsChange({ width, height, depth })
  }, [width, height, depth, onDimensionsChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(
      {
        name,
        businessName,
        deliveryAddress,
        width,
        height,
        depth,
        quantity,
        weight,
        dateRequired
      }
    )
  }

  // Get tomorrow's date for min date attribute
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="quantity">Quantity of Crates Required</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="width">Width Required (mm)</Label>
        <Input
          id="width"
          type="number"
          min="0.1"
          max="2400"
          step="0.1"
          value={width}
          onChange={(e) => validateAndUpdateDimension(Number(e.target.value), 'width')}
          className={validationErrors.width ? "border-red-500" : ""}
          required
        />
        {validationErrors.width && (
          <Alert variant="destructive" className="py-2 px-3 mt-1">
            <AlertDescription>{validationErrors.width}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="height">Height Required (mm)</Label>
        <Input
          id="height"
          type="number"
          min="0.1"
          max="2400"
          step="0.1"
          value={height}
          onChange={(e) => validateAndUpdateDimension(Number(e.target.value), 'height')}
          className={validationErrors.height ? "border-red-500" : ""}
          required
        />
        {validationErrors.height && (
          <Alert variant="destructive" className="py-2 px-3 mt-1">
            <AlertDescription>{validationErrors.height}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="depth">Depth Required (mm)</Label>
        <Input
          id="depth"
          type="number"
          min="0.1"
          max="2400"
          step="0.1"
          value={depth}
          onChange={(e) => validateAndUpdateDimension(Number(e.target.value), 'depth')}
          className={validationErrors.depth ? "border-red-500" : ""}
          required
        />
        {validationErrors.depth && (
          <Alert variant="destructive" className="py-2 px-3 mt-1">
            <AlertDescription>{validationErrors.depth}</AlertDescription>
          </Alert>
        )}
      </div>
      <div>
        <Label htmlFor="weight">Weight Rating(kg)</Label>
        <Input
          id="weight"
          type="number"
          min="0.1"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="dateRequired">Date Required</Label>
        <Input
          id="dateRequired"
          type="date"
          min={minDate}
          value={dateRequired}
          onChange={(e) => setDateRequired(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="deliveryAddress">Address of Delivery</Label>
        <Input
          id="deliveryAddress"
          type="text"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          required
        />
      </div>
     
      
    
      <Button type="submit">Submit Order</Button>
    </form>
  )
}