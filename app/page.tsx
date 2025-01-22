"use client"

import { OrderForm, OrderFormData } from "@/components/OrderForm"
import { CrateVisualizer } from "@/components/Visualizer"
import { toast } from "@/hooks/use-toast"
import { sendEmail } from "./actions/sendEmail"
import { useMemo, useState } from "react"


export default function Page() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000, depth: 1000 })

  const normalizedDimensions = useMemo(()=> {
    return {
      width: dimensions.width / 1000,
      height: dimensions.height / 1000,
      depth: dimensions.depth / 1000
    }
  }, [dimensions])

  const handleFormSubmit = async (data: OrderFormData) => {
    if (!data) {
      toast({
        title: "Error",
        description: "Please enter all required fields",
        variant: "destructive",
      })
      return
    }


    const result = await sendEmail(data)

    if (result.success) {
      toast({
        title: "Order Submitted",
        description: "Check your inbox for order details",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      })
    }
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Wooden Crate Visualizer</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <CrateVisualizer {...normalizedDimensions} />
        </div>
        <div className="space-y-6">
          <OrderForm onSubmit={handleFormSubmit} onDimensionsChange={setDimensions} dimensions={dimensions} />
        </div>
      </div>
    </div>
  )
}

