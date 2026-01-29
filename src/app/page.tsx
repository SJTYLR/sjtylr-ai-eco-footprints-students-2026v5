'use client'
// AI Environmental Impact Estimator 2026 - Wayfinder Learning Lab
// Updated: 2025-01-28

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Leaf, Zap, Droplet, Car, Trees, Smartphone, Gauge, ChevronDown, ChevronUp, BookOpen, FileText, BarChart2, Calendar, Search, MessageCircle, RefreshCw, CheckCircle, HardDrive, Layers, ImageOff, SearchCheck, FolderOpen } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = {
  primary: '#1C374A',
  secondary: '#3EB1BA',
  tertiary: '#265A7C',
  accent: '#8ED1E2',
  highlight: '#F2B184',
  white: '#FFFFFF',
  lightGray: '#F4F4F0',
  mutedDark: '#6E6E6E',
  coral: '#E96F6F',
  mango: '#FF9A62',
  papaya: '#FF9A52',
  crimson: '#482734'
}

const RGBA = {
  coral60: 'rgba(233, 111, 111, 0.6)',
  mango60: 'rgba(255, 154, 98, 0.6)',
  papaya60: 'rgba(255, 154, 82, 0.6)',
  lightGray18: 'rgba(244, 244, 240, 0.18)',
  highlight60: 'rgba(242, 177, 132, 0.6)',
}

const GRID_TYPES = {
  clean: { name: 'Clean Grid', emissions: 15, examples: 'Norway (17), Iceland (8), France (21-57)', description: 'Predominantly hydro, nuclear, and geothermal', color: COLORS.accent },
  renewableHeavy: { name: 'Renewable Heavy', emissions: 150, examples: 'Denmark (156-173), EU average (213)', description: 'Wind and solar dominant with fossil backup', color: COLORS.secondary },
  mixed: { name: 'Mixed Grid', emissions: 450, examples: 'Global average (473), US (400-450)', description: 'Mix of fossil fuels, nuclear, and renewables', color: COLORS.highlight },
  coalHeavy: { name: 'Coal-Heavy', emissions: 650, examples: 'Poland (618-836), China (560)', description: 'Coal-dominant generation', color: COLORS.crimson }
}

const EFFICIENCY_MULTIPLIERS = {
  local: 1.0, // Baseline - depends on local power source
  lessEfficient: 1.0, // Baseline - older models
  moreEfficient: 0.3 // 70% less energy than baseline
}

const TASK_FACTORS = {
  textGen: { energyKwhPerUnit: 0.00027, waterMlPerUnit: 0.00026, name: 'Text Generation', unit: 'queries', icon: Zap, color: COLORS.accent },
  images: { energyKwhPerUnit: 0.0014, name: 'Image Generation', unit: 'images', icon: Smartphone, color: COLORS.secondary },
  coding: { energyKwhPerUnit: 0.0003, name: 'Coding Tasks', unit: 'tasks', icon: Gauge, color: COLORS.highlight },
  video: { energyKwhPerUnit: 12, name: 'Video Generation', unit: 'minutes', icon: Smartphone, color: COLORS.crimson },
  audio: { energyKwhPerUnit: 0.06, name: 'Audio Generation', unit: 'minutes', icon: Smartphone, color: COLORS.tertiary },
  analysis: { energyKwhPerUnit: 0.0005, name: 'Data Analysis', unit: 'tasks', icon: Gauge, color: COLORS.primary },
  deepResearch: { energyKwhPerUnit: 0.0054, name: 'Deep Research', unit: 'queries', icon: Search, color: COLORS.mango }
}

export default function Home() {
  const [tasks, setTasks] = useState({
    textGen: 0,
    images: 0,
    coding: 0,
    video: 0,
    audio: 0,
    analysis: 0,
    deepResearch: 0
  })

  const [results, setResults] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [showProjections, setShowProjections] = useState(false)
  const [showReductionStrategies, setShowReductionStrategies] = useState(false)
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km')
  const [impactUnit, setImpactUnit] = useState<'energy' | 'carbon'>('carbon')
  const [userLocation, setUserLocation] = useState<string>('mixed')
  const [aiModelEfficiency, setAiModelEfficiency] = useState<string>('lessEfficient')

  const calculateImpact = () => {
    const grid = GRID_TYPES[userLocation as keyof typeof GRID_TYPES]
    const efficiencyMultiplier = EFFICIENCY_MULTIPLIERS[aiModelEfficiency as keyof typeof EFFICIENCY_MULTIPLIERS]
    const taskBreakdown = Object.entries(tasks).map(([key, value]) => {
      const factor = TASK_FACTORS[key as keyof typeof TASK_FACTORS]
      if (!value || value <= 0) return null
      const energy = value * factor.energyKwhPerUnit * efficiencyMultiplier
      const co2 = (energy * grid.emissions) / 1000
      let water: number
      if (key === 'textGen' && 'waterMlPerUnit' in factor && factor.waterMlPerUnit) {
        water = value * factor.waterMlPerUnit * efficiencyMultiplier
      } else {
        water = energy * 1.9
      }
      return { key, name: factor.name, value, energy, co2, water }
    }).filter(Boolean) as Array<{key: string, name: string, value: number, energy: number, co2: number, water: number}>

    const totals = {
      energy: taskBreakdown.reduce((sum, t) => sum + t.energy, 0),
      co2: taskBreakdown.reduce((sum, t) => sum + t.co2, 0),
      water: taskBreakdown.reduce((sum, t) => sum + t.water, 0)
    }

    const kmDriven = totals.co2 / 0.25
    const milesDriven = kmDriven * 0.6214
    const treeMonths = totals.co2 / 1.75
    const phoneCharges = totals.energy / 0.015
    const showers = (totals.water * 1000) / 65000
    const lightbulbHours = totals.energy / 0.06

    setResults({
      totals,
      equivalencies: { kmDriven, milesDriven, treeMonths, phoneCharges, showers, lightbulbHours },
      taskBreakdown,
      projections: {
        week: {
          co2: totals.co2 * 7,
          kmDriven: kmDriven * 7,
          milesDriven: milesDriven * 7,
          treeMonths: treeMonths * 7 / 30,
          phoneCharges: phoneCharges * 7,
          showers: showers * 7,
          lightbulbHours: lightbulbHours * 7
        },
        month: {
          co2: totals.co2 * 30,
          kmDriven: kmDriven * 30,
          milesDriven: milesDriven * 30,
          treeMonths: treeMonths,
          phoneCharges: phoneCharges * 30,
          showers: showers * 30,
          lightbulbHours: lightbulbHours * 30
        },
        semester: {
          co2: totals.co2 * 140,
          kmDriven: kmDriven * 140,
          milesDriven: milesDriven * 140,
          treeMonths: treeMonths * 140 / 30,
          phoneCharges: phoneCharges * 140,
          showers: showers * 140,
          lightbulbHours: lightbulbHours * 140
        }
      }
    })
    setShowResults(true)
  }

  const resetForm = () => {
    setTasks({ textGen: 0, images: 0, coding: 0, video: 0, audio: 0, analysis: 0, deepResearch: 0 })
    setUserLocation('mixed')
    setAiModelEfficiency('lessEfficient')
    setResults(null)
    setShowResults(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.lightGray }}>
      <header style={{ backgroundColor: COLORS.white, borderBottom: '1px solid #E5E7EB' }} className="sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
              AI Environmental Impact Estimator 2026
            </h1>
            <p className="text-sm mt-1" style={{ color: COLORS.mutedDark }}>
              (If You) USEME-AI - The Wayfinder Learning Lab (Stephen Taylor, WAB)
            </p>
          </div>
        </div>
      </header>

      {/* About This App */}
      <div className="container mx-auto px-4 py-4 mb-4">
        <Card style={{ backgroundColor: COLORS.white, border: '2px solid #E5E7EB' }}>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.primary }}>About This App</h2>
            <p className="text-sm" style={{ color: COLORS.mutedDark }}>
              This tool helps students estimate and visualise the environmental impacts of using AI. By entering your AI usage (such as text generation, deep research, image creation, coding tasks, video generation, audio generation, and data analysis), you can understand the energy consumption, carbon emissions, and water usage associated with your activities.
            </p>
            <p className="text-sm mt-2" style={{ color: COLORS.mutedDark }}>
              The calculator uses average electricity grid impacts and the most popular AI models to provide estimates. You can explore how different energy grid types and AI model efficiencies affect these impacts by expanding the sections below.
            </p>
            <p className="text-sm mt-3 font-medium" style={{ color: COLORS.coral }}>
              ⚠️ This app is for demonstration only. Data for environmental impacts of AI are very variable and there might be errors. Use your own critical thinking and research to verify your results and find out more.
            </p>
          </CardContent>
        </Card>
      </div>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <Card className="mb-6">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setShowMethodology(!showMethodology)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: COLORS.primary }} />
                <CardTitle style={{ color: COLORS.primary }}>
                  Understanding AI Environmental Impact
                </CardTitle>
              </div>
              {showMethodology ? <ChevronUp className="h-5 w-5" style={{ color: COLORS.primary }} /> : <ChevronDown className="h-5 w-5" style={{ color: COLORS.primary }} />}
            </div>
          </CardHeader>
          {showMethodology && (
          <CardContent className="pt-0">
            <div className="space-y-6 text-sm" style={{ color: COLORS.mutedDark }}>
              <div className="p-4 rounded-lg" style={{ backgroundColor: RGBA.highlight60 }}>
                <p className="mb-3">
                  <strong style={{ color: COLORS.primary }}>Grid Type:</strong> The "Mixed Grid" option represents an average of global energy data and accounts for both grid carbon intensity and typical AI model efficiency. This is a reasonable default for general estimation.
                </p>
                <p>
                  Your actual environmental impact may be significantly different depending on your location and AI models you use. Click on the expandable sections below to learn more about grid types and AI model efficiency.
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ border: '2px solid #E5E7EB' }}>
                <h4 className="font-semibold mb-4" style={{ color: COLORS.primary }}>Where are you?</h4>
                <p className="mb-3 text-sm">
                  Select the type of energy grid in your region to better understand your potential impact:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="location"
                        value="clean"
                        checked={userLocation === 'clean'}
                        onChange={(e) => setUserLocation(e.target.value as any)}
                        className="mr-2"
                      />
                      <span>Clean Grid</span>
                    </label>
                    <p className="text-xs ml-7" style={{ color: COLORS.mutedDark }}>
                      <strong>Examples:</strong> Norway, Iceland, France (15 gCO₂/kWh)<br/>
                      <strong>Impact:</strong> Lowest emissions if AI is hosted locally
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="location"
                        value="renewableHeavy"
                        checked={userLocation === 'renewableHeavy'}
                        onChange={(e) => setUserLocation(e.target.value as any)}
                        className="mr-2"
                      />
                      <span>Renewable Heavy</span>
                    </label>
                    <p className="text-xs ml-7" style={{ color: COLORS.mutedDark }}>
                      <strong>Examples:</strong> Denmark, EU average (150 gCO₂/kWh)<br/>
                      <strong>Impact:</strong> High renewables, but fossil backup for reliability
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="location"
                        value="mixed"
                        checked={userLocation === 'mixed'}
                        onChange={(e) => setUserLocation(e.target.value as any)}
                        className="mr-2"
                      />
                      <span>Mixed Grid (Default)</span>
                    </label>
                    <p className="text-xs ml-7" style={{ color: COLORS.mutedDark }}>
                      <strong>Examples:</strong> Global average, US (450 gCO₂/kWh)<br/>
                      <strong>Impact:</strong> Average of different grid types - reasonable default for estimation
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="location"
                        value="coalHeavy"
                        checked={userLocation === 'coalHeavy'}
                        onChange={(e) => setUserLocation(e.target.value as any)}
                        className="mr-2"
                      />
                      <span>Coal-Heavy</span>
                    </label>
                    <p className="text-xs ml-7" style={{ color: COLORS.mutedDark }}>
                      <strong>Examples:</strong> Poland, China (650 gCO₂/kWh)<br/>
                      <strong>Impact:</strong> Highest emissions - common in rapidly growing AI markets
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ border: '2px solid #E5E7EB' }}>
                <h4 className="font-semibold mb-4" style={{ color: COLORS.primary }}>What AI models are you using?</h4>
                <p className="mb-3 text-sm">
                  AI model efficiency has a major impact on environmental footprint. Newer, more efficient models can reduce impact by 5-10x:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="aiEfficiency"
                        value="local"
                        checked={aiModelEfficiency === 'local'}
                        onChange={(e) => setAiModelEfficiency(e.target.value as any)}
                        className="mr-2"
                      />
                      <span>Locally Hosted</span>
                    </label>
                    <p className="text-xs ml-7" style={{ color: COLORS.mutedDark }}>
                      <strong>Examples:</strong> Ollama, Mistral, DeepSeek, Qwen running locally on your hardware
                    </p>
                    <p className="text-xs mt-2" style={{ color: COLORS.primary }}>
                      Impact: Can use clean energy, but depends heavily on your local power source
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="aiEfficiency"
                        value="lessEfficient"
                        checked={aiModelEfficiency === 'lessEfficient'}
                        onChange={(e) => setAiModelEfficiency(e.target.value as any)}
                        className="mr-2"
                      />
                      <span>Less Efficient</span>
                    </label>
                    <p className="text-xs ml-7" style={{ color: COLORS.mutedDark }}>
                      <strong>Examples:</strong> Llama-3, GPT-3.5, Claude Haiku, older ChatGPT versions
                    </p>
                    <p className="text-xs mt-2" style={{ color: COLORS.primary }}>
                      Impact: 2-5x less impact than most efficient models
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="aiEfficiency"
                        value="moreEfficient"
                        checked={aiModelEfficiency === 'moreEfficient'}
                        onChange={(e) => setAiModelEfficiency(e.target.value as any)}
                        className="mr-2"
                      />
                      <span>More Efficient</span>
                    </label>
                    <p className="text-xs ml-7" style={{ color: COLORS.mutedDark }}>
                      <strong>Examples:</strong> GPT-4o, Claude Sonnet, DeepSeek V3, latest ChatGPT, o1
                    </p>
                    <p className="text-xs mt-2" style={{ color: COLORS.primary }}>
                      Impact: Best available efficiency - lowest environmental impact
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.accent }}>
                <p className="text-sm font-medium mb-2" style={{ color: COLORS.white }}>
                  <strong>Key Insight:</strong> AI environmental impacts are highly complex and depend on multiple factors beyond just grid type.
                </p>
                <p className="text-xs" style={{ color: COLORS.white }}>
                  You might be in Norway using ChatGPT (US data centers, Mixed Grid: 450 gCO₂/kWh), or in China using Deepseek (China data centers, Coal-Heavy: 650 gCO₂/kWh). The grid type in this calculator represents averages across global data, which may not match your specific situation.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle style={{ color: COLORS.primary }}>AI Task Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(TASK_FACTORS).map(([key, factor]) => {
                const Icon = factor.icon
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2" style={{ color: COLORS.primary }}>
                      <Icon className="h-4 w-4" style={{ color: factor.color }} />
                      {factor.name}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={tasks[key as keyof typeof tasks]}
                      onChange={(e) => setTasks({ ...tasks, [key]: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder={`Number of ${factor.unit}`}
                    />
                    <p className="text-xs" style={{ color: COLORS.mutedDark }}>
                      Enter number of {factor.unit}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={calculateImpact}
                className="px-8 py-3 rounded-lg font-semibold"
                style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
              >
                Calculate Impact
              </Button>
              <Button
                onClick={resetForm}
                className="px-8 py-3 rounded-lg font-semibold border-2"
                style={{ backgroundColor: COLORS.white, borderColor: COLORS.primary, color: COLORS.primary }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {showResults && results && (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle style={{ color: COLORS.primary }}>Environmental Impact Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-lg" style={{ border: '2px solid #E5E7EB' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="h-6 w-6" style={{ color: COLORS.secondary }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.mutedDark }}>Energy Used</span>
                    </div>
                    <div className="text-3xl font-bold" style={{ color: COLORS.secondary }}>
                      {results.totals.energy.toFixed(4)} kWh
                    </div>
                  </div>
                  <div className="p-6 rounded-lg" style={{ border: '2px solid #E5E7EB' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <Leaf className="h-6 w-6" style={{ color: COLORS.crimson }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.mutedDark }}>Carbon Emissions</span>
                    </div>
                    <div className="text-3xl font-bold" style={{ color: COLORS.crimson }}>
                      {results.totals.co2.toFixed(4)} kg CO₂
                    </div>
                  </div>
                  <div className="p-6 rounded-lg" style={{ border: '2px solid #E5E7EB' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <Droplet className="h-6 w-6" style={{ color: COLORS.tertiary }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.mutedDark }}>Water Used</span>
                    </div>
                    <div className="text-3xl font-bold" style={{ color: COLORS.tertiary }}>
                      {results.totals.water.toFixed(2)} L
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle style={{ color: COLORS.primary }}>Impact Equivalencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: RGBA.coral60 }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="h-5 w-5" style={{ color: COLORS.white }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.white }}>{distanceUnit === 'km' ? 'km Driven' : 'Miles Driven'}</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.white }}>
                      {distanceUnit === 'km' ? results.equivalencies.kmDriven.toFixed(1) : results.equivalencies.milesDriven.toFixed(1)}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: RGBA.mango60 }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Trees className="h-5 w-5" style={{ color: COLORS.white }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.white }}>Tree Offset</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.white }}>
                      {results.equivalencies.treeMonths.toFixed(1)} mo
                    </div>
                  </div>

                  <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: RGBA.papaya60 }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-5 w-5" style={{ color: COLORS.white }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.white }}>Phone Charges</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.white }}>
                      {results.equivalencies.phoneCharges.toFixed(1)}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: RGBA.lightGray18, border: '1px solid #E5E7EB' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="h-5 w-5" style={{ color: COLORS.mutedDark }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.mutedDark }}>Showers</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.mutedDark }}>
                      {results.equivalencies.showers.toFixed(1)}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: RGBA.highlight60 }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="h-5 w-5" style={{ color: COLORS.white }} />
                      <span className="text-sm font-medium" style={{ color: COLORS.white }}>Lightbulb Hours</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.white }}>
                      {results.equivalencies.lightbulbHours.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button
                    onClick={() => setDistanceUnit(distanceUnit === 'km' ? 'miles' : 'km')}
                    className="px-4 py-2 text-sm rounded-lg"
                    style={{ backgroundColor: distanceUnit === 'km' ? 'rgba(255,255,255,255,0.3)' : 'transparent', color: distanceUnit === 'km' ? COLORS.white : COLORS.primary, border: `1px solid ${distanceUnit === 'km' ? COLORS.primary : 'rgba(255,255,255,255,0.3)'}` }}
                  >
                    {distanceUnit === 'km' ? 'Switch to Miles' : 'Switch to km'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {results.taskBreakdown && results.taskBreakdown.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle style={{ color: COLORS.primary }}>Task Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.taskBreakdown.map((task) => {
                      const Icon = TASK_FACTORS[task.key as keyof typeof TASK_FACTORS]?.icon || Zap
                      const color = TASK_FACTORS[task.key as keyof typeof TASK_FACTORS]?.color || COLORS.primary
                      return (
                        <div key={task.key} className="p-4 rounded-lg" style={{ border: '1px solid #E5E7EB' }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" style={{ color }} />
                              <span className="font-medium" style={{ color: COLORS.primary }}>{task.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm" style={{ color: COLORS.mutedDark }}>{task.value} {TASK_FACTORS[task.key as keyof typeof TASK_FACTORS]?.unit}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-xs" style={{ color: COLORS.mutedDark }}>Energy:</span>
                              <span className="font-medium" style={{ color: COLORS.secondary }}>{task.energy.toFixed(5)} kWh</span>
                            </div>
                            <div>
                              <span className="text-xs" style={{ color: COLORS.mutedDark }}>CO₂:</span>
                              <span className="font-medium" style={{ color: COLORS.crimson }}>{task.co2.toFixed(5)} kg</span>
                            </div>
                            <div>
                              <span className="text-xs" style={{ color: COLORS.mutedDark }}>Water:</span>
                              <span className="font-medium" style={{ color: COLORS.tertiary }}>{task.water.toFixed(2)} L</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-8">
              <CardHeader
                className="cursor-pointer"
                onClick={() => setShowProjections(!showProjections)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" style={{ color: COLORS.primary }} />
                    <CardTitle style={{ color: COLORS.primary }}>
                      Impact Projections
                    </CardTitle>
                  </div>
                  {showProjections ? <ChevronUp className="h-5 w-5" style={{ color: COLORS.primary }} /> : <ChevronDown className="h-5 w-5" style={{ color: COLORS.primary }} />}
                </div>
              </CardHeader>
              {showProjections && (
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    <div className="p-6 rounded-lg" style={{ border: '2px solid #E5E7EB' }}>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primary }}>Weekly (7 days)</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-5 w-5" style={{ color: COLORS.crimson }} />
                          <span><strong>{results.projections.week.co2.toFixed(4)} kg CO₂</strong> emissions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-5 w-5" style={{ color: COLORS.secondary }} />
                          <span>
                            <strong>= {distanceUnit === 'km' ? results.projections.week.kmDriven.toFixed(1) : results.projections.week.milesDriven.toFixed(1)} {distanceUnit}</strong> driven
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trees className="h-5 w-5" style={{ color: COLORS.accent }} />
                          <span>
                            <strong>= {results.projections.week.treeMonths.toFixed(1)} months</strong> of tree growth
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5" style={{ color: COLORS.highlight }} />
                          <span>
                            <strong>= {results.projections.week.phoneCharges.toFixed(1)} charges</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplet className="h-5 w-5" style={{ color: COLORS.tertiary }} />
                          <span>
                            <strong>= {results.projections.week.showers.toFixed(1)} showers</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-5 w-5" style={{ color: COLORS.primary }} />
                          <span>
                            <strong>= {results.projections.week.lightbulbHours.toFixed(1)} hours</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-lg" style={{ border: '2px solid #E5E7EB' }}>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primary }}>Monthly (30 days)</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-5 w-5" style={{ color: COLORS.crimson }} />
                          <span><strong>{results.projections.month.co2.toFixed(4)} kg CO₂</strong> emissions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-5 w-5" style={{ color: COLORS.secondary }} />
                          <span>
                            <strong>= {distanceUnit === 'km' ? results.projections.month.kmDriven.toFixed(1) : results.projections.month.milesDriven.toFixed(1)} {distanceUnit}</strong> driven
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trees className="h-5 w-5" style={{ color: COLORS.accent }} />
                          <span>
                            <strong>= {results.projections.month.treeMonths.toFixed(1)} months</strong> of tree growth
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5" style={{ color: COLORS.highlight }} />
                          <span>
                            <strong>= {results.projections.month.phoneCharges.toFixed(1)} charges</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplet className="h-5 w-5" style={{ color: COLORS.tertiary }} />
                          <span>
                            <strong>= {results.projections.month.showers.toFixed(1)} showers</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-5 w-5" style={{ color: COLORS.primary }} />
                          <span>
                            <strong>= {results.projections.month.lightbulbHours.toFixed(1)} hours</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-lg" style={{ border: '2px solid #E5E7EB' }}>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primary }}>Semester (140 days)</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-5 w-5" style={{ color: COLORS.crimson }} />
                          <span><strong>{results.projections.semester.co2.toFixed(4)} kg CO₂</strong> emissions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-5 w-5" style={{ color: COLORS.secondary }} />
                          <span>
                            <strong>= {distanceUnit === 'km' ? results.projections.semester.kmDriven.toFixed(1) : results.projections.semester.milesDriven.toFixed(1)} {distanceUnit}</strong> driven
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trees className="h-5 w-5" style={{ color: COLORS.accent }} />
                          <span>
                            <strong>= {results.projections.semester.treeMonths.toFixed(1)} months</strong> of tree growth
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5" style={{ color: COLORS.highlight }} />
                          <span>
                            <strong>= {results.projections.semester.phoneCharges.toFixed(1)} charges</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplet className="h-5 w-5" style={{ color: COLORS.tertiary }} />
                          <span>
                            <strong>= {results.projections.semester.showers.toFixed(1)} showers</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-5 w-5" style={{ color: COLORS.primary }} />
                          <span>
                            <strong>= {results.projections.semester.lightbulbHours.toFixed(1)} hours</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </>
        )}

        {/* Reducing AI Environmental Impact */}
        <Card className="mb-8">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setShowReductionStrategies(!showReductionStrategies)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5" style={{ color: COLORS.primary }} />
                <CardTitle style={{ color: COLORS.primary }}>
                  How Can I Reduce The Impacts Of My AI Use?
                </CardTitle>
              </div>
              {showReductionStrategies ? <ChevronUp className="h-5 w-5" style={{ color: COLORS.primary }} /> : <ChevronDown className="h-5 w-5" style={{ color: COLORS.primary }} />}
            </div>
          </CardHeader>
          {showReductionStrategies && (
            <CardContent className="pt-0">
              <div className="space-y-4 text-sm" style={{ color: COLORS.mutedDark }}>
                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.white, border: '2px solid #E5E7EB' }}>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-6 w-6 mt-1" style={{ color: COLORS.secondary }} />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Practice Prompt Hygiene</h4>
                      <p className="text-sm">
                        Write clear, specific prompts to reduce unnecessary back-and-forth exchanges. Combine multiple related questions into single, well-structured queries. This reduces total number of AI requests and energy consumption.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.white, border: '2px solid #E5E7EB' }}>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-6 w-6 mt-1" style={{ color: COLORS.primary }} />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Reuse & Refine Outputs</h4>
                      <p className="text-sm">
                        Instead of regenerating content, manually edit and improve AI outputs yourself. Save useful responses for future reference instead of asking AI to regenerate similar content multiple times.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.white, border: '2px solid #E5E7EB' }}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 mt-1" style={{ color: COLORS.accent }} />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Choose Efficient Models</h4>
                      <p className="text-sm">
                        When available, select more efficient AI models (like GPT-4o or Claude Sonnet) that consume significantly less energy per task than older or larger models.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.white, border: '2px solid #E5E7EB' }}>
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-6 w-6 mt-1" style={{ color: COLORS.tertiary }} />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Use Local Models When Possible</h4>
                      <p className="text-sm">
                        If you have computing resources, consider running AI models locally (with tools like Ollama or LM Studio). This can reduce energy usage if your local power comes from clean sources.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.white, border: '2px solid #E5E7EB' }}>
                  <div className="flex items-start gap-3">
                    <Layers className="h-6 w-6 mt-1" style={{ color: COLORS.secondary }} />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Batch Related Tasks Together</h4>
                      <p className="text-sm">
                        Combine multiple related queries or requests into single, comprehensive prompts rather than making many small, individual requests. This reduces total energy overhead from data center infrastructure.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.white, border: '2px solid #E5E7EB' }}>
                  <div className="flex items-start gap-3">
                    <ImageOff className="h-6 w-6 mt-1" style={{ color: COLORS.crimson }} />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Limit Media Generation</h4>
                      <p className="text-sm">
                        Only generate new images or videos when truly necessary. If you have existing media or can find suitable alternatives, avoid generating new content as AI media is especially energy-intensive.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.white, border: '2px solid #E5E7EB' }}>
                  <div className="flex items-start gap-3">
                    <SearchCheck className="h-6 w-6 mt-1" style={{ color: COLORS.highlight }} />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Verify Before Using AI</h4>
                      <p className="text-sm">
                        Use traditional search engines or existing resources before asking AI for research. This reduces unnecessary AI queries, especially for factual information that's readily available.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.white, border: '2px solid #E5E7EB' }}>
                  <div className="flex items-start gap-3">
                    <FolderOpen className="h-6 w-6 mt-1" style={{ color: COLORS.primary }} />
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>Clean, Organise & Reuse</h4>
                      <p className="text-sm">
                        Organise AI outputs in searchable libraries or documents. Reuse and adapt previous responses instead of generating new content for similar tasks. Build a personal knowledge base over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Calculation Methodology */}
        <Card className="mb-8">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setShowMethodology(!showMethodology)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: COLORS.primary }} />
                <CardTitle style={{ color: COLORS.primary }}>
                  Calculation Methodology
                </CardTitle>
              </div>
              {showMethodology ? <ChevronUp className="h-5 w-5" style={{ color: COLORS.primary }} /> : <ChevronDown className="h-5 w-5" style={{ color: COLORS.primary }} />}
            </div>
          </CardHeader>
          {showMethodology && (
            <CardContent className="pt-0">
              <div className="space-y-6 text-sm" style={{ color: COLORS.mutedDark }}>
                <div className="p-4 rounded-lg" style={{ backgroundColor: RGBA.highlight60 }}>
                  <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>Energy Calculations</h4>
                  <p className="mb-3">
                    <strong style={{ color: COLORS.primary }}>Base Energy (kWh) = Number of Tasks × Energy per Task</strong>
                  </p>
                  <p className="mb-3">
                    <strong style={{ color: COLORS.primary }}>Final Energy (kWh) = Base Energy × Efficiency Multiplier</strong>
                  </p>
                  <p className="mb-3 text-xs" style={{ color: COLORS.mutedDark }}>
                    AI model efficiency multipliers: Local (1.0×), Less Efficient (1.0×), More Efficient (0.3× - 70% less energy)
                  </p>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li><strong style={{ color: COLORS.primary }}>Text Generation:</strong> Base = queries × 0.00027 kWh/query</li>
                    <li><strong style={{ color: COLORS.primary }}>Deep Research:</strong> Base = queries × 0.0054 kWh/query (20× text generation - multi-step reasoning)</li>
                    <li><strong style={{ color: COLORS.primary }}>Image Generation:</strong> Base = images × 0.0014 kWh/image</li>
                    <li><strong style={{ color: COLORS.primary }}>Coding Tasks:</strong> Base = tasks × 0.0003 kWh/task</li>
                    <li><strong style={{ color: COLORS.primary }}>Video Generation:</strong> Base = minutes × 12 kWh/min</li>
                    <li><strong style={{ color: COLORS.primary }}>Audio Generation:</strong> Base = minutes × 0.06 kWh/min</li>
                    <li><strong style={{ color: COLORS.primary }}>Data Analysis:</strong> Base = tasks × 0.0005 kWh/analysis</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: RGBA.highlight60 }}>
                  <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>Carbon Emissions</h4>
                  <p className="mb-2">
                    <strong style={{ color: COLORS.primary }}>CO₂ (kg) = Final Energy (kWh) × Grid Emissions (gCO₂/kWh) / 1000</strong>
                  </p>
                  <p className="mb-2">
                    <em>Note:</em> Final Energy already includes AI model efficiency multiplier
                  </p>
                  <p>
                    Grid emissions vary by energy source: Clean (15 gCO₂/kWh), Renewable Heavy (150 gCO₂/kWh), Mixed (450 gCO₂/kWh), Coal-Heavy (650 gCO₂/kWh)
                  </p>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: RGBA.highlight60 }}>
                  <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>Water Usage</h4>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li><strong style={{ color: COLORS.primary }}>Text:</strong> Water = queries × 0.00026 mL × Efficiency Multiplier (direct measurement)</li>
                    <li><strong style={{ color: COLORS.primary }}>Other Tasks:</strong> Water = Final Energy (kWh) × 1.9 L/kWh (WUE = Water Usage Effectiveness)</li>
                  </ul>
                  <p className="mt-2 text-xs" style={{ color: COLORS.mutedDark }}>
                    Final Energy is efficiency-adjusted based on AI model choice
                  </p>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: RGBA.highlight60 }}>
                  <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>Equivalencies</h4>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li><strong style={{ color: COLORS.primary }}>Distance:</strong> CO₂ ÷ 0.25 kg/km (or × 0.6214 for miles)</li>
                    <li><strong style={{ color: COLORS.primary }}>Tree Offset:</strong> CO₂ ÷ 1.75 kg/month (21 kg CO₂ sequestered per tree per year ÷ 12 months)</li>
                    <li><strong style={{ color: COLORS.primary }}>Phone Charges:</strong> Energy ÷ 0.015 kWh/charge</li>
                    <li><strong style={{ color: COLORS.mutedDark }}>Shower:</strong> Water (mL) ÷ 65,000 mL (65 L per average shower)</li>
                    <li><strong style={{ color: COLORS.primary }}>Lightbulb:</strong> Energy ÷ 0.06 kWh/hour</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Research Sources & References */}
        <Card className="mb-8">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setShowSources(!showSources)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: COLORS.primary }} />
                <CardTitle style={{ color: COLORS.primary }}>
                  Research Sources & References
                </CardTitle>
              </div>
              {showSources ? <ChevronUp className="h-5 w-5" style={{ color: COLORS.primary }} /> : <ChevronDown className="h-5 w-5" style={{ color: COLORS.primary }} />}
            </div>
          </CardHeader>
          {showSources && (
            <CardContent className="pt-0">
              <div className="space-y-6 text-sm" style={{ color: COLORS.mutedDark }}>
                <p className="text-slate-700 italic mb-6">
                  All calculations based on peer-reviewed research and industry reports from 2024-2025
                </p>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #8ED1E2' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    Sasha Luccioni - Hugging Face Blog
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Comprehensive analysis of AI data centers and their environmental impact, including carbon emissions across different AI tasks.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>Image generation: 1.6 g CO₂ per image</li>
                    <li>1,000 images = CO₂ equivalent to driving 6.6 km (4.1 miles)</li>
                    <li>Image generation uses as much energy as charging a smartphone</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://huggingface.co/blog/sasha/ai-data-centers-explained" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> Hugging Face Blog
                    </a>
                  </p>
                </div>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #3EB1BA' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    MIT Technology Review (December 2023)
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Featured article on environmental cost of generating images with AI, highlighting energy consumption and emissions data.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>"Making an image with generative AI uses as much energy as charging your phone"</li>
                    <li>First major publication to bring attention to AI's carbon footprint</li>
                    <li>Based on Sasha Luccioni's research findings</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://www.technologyreview.com/2023/12/01/1084189/making-an-image-with-generative-ai-uses-as-much-energy-as-charging-your-phone" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> MIT Technology Review, December 2023
                    </a>
                  </p>
                </div>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #265A7C' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    Hannah Ritchie - Our World in Data (August 2025)
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Updated analysis with Google's new Gemini environmental metrics. Comprehensive review of AI footprint.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>Confirms 0.24-0.3 Wh per text query</li>
                    <li>Video generation (Sora): ~1 kWh per 5-second clip</li>
                    <li>5-second video = microwave running for over an hour</li>
                    <li>AI footprint is small for individual users, significant at scale</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://hannahritchie.substack.com/p/ai-footprint-august-2025" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> Substack "Our World in Data", August 2025
                    </a>
                  </p>
                </div>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #60A5FA' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    Our World in Data - Artificial Intelligence
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Comprehensive resource featuring many interactive charts and short articles exploring AI adoption, development, and environmental impacts worldwide.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>Interactive visualizations of AI adoption trends</li>
                    <li>Data on AI computing power and energy use</li>
                    <li>Global comparisons across countries and applications</li>
                    <li>Short, accessible articles on AI topics</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://ourworldindata.org/artificial-intelligence" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> Our World in Data - Artificial Intelligence
                    </a>
                  </p>
                </div>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #F2B184' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    Dev Sustainability - Google Gemini Impact (2025)
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Detailed breakdown of Google's Gemini AI model environmental metrics.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>Provides per-request energy and carbon data</li>
                    <li>Contextualizes impact against daily activities</li>
                    <li>Industry-leading transparency in AI environmental reporting</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://www.devsustainability.com/p/the-environmental-impact-of-google-gemini" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> Dev Sustainability, 2025
                    </a>
                  </p>
                </div>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #E96F6F' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    Epoch AI - How Much Energy Does ChatGPT Use? (2025)
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Analysis of large language model energy consumption and infrastructure requirements.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>Infrastructure energy for AI inference</li>
                    <li>Training vs. inference energy breakdown</li>
                    <li>Efficiency improvements in newer models</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> Epoch AI, 2025
                    </a>
                  </p>
                </div>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #FF9A62' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    PMC - AI vs Human Programming (2025)
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Correctness-controlled comparison of AI and human programmers' environmental impact.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>GPT-4 emits 5-19× more CO₂e than humans for programming tasks</li>
                    <li>Smaller models (GPT-4o-mini) can match human emissions when successful</li>
                    <li>Standard widely-used models are far more environmentally intensive</li>
                    <li>USACO database used for objective programming challenges</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12603251" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> PubMed Central (PMC), 2025
                    </a>
                  </p>
                </div>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #FF9A52' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    ArXiv - Text-to-Audio Energy Study (2025)
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Analysis of energy consumption for 7 state-of-the-art text-to-audio diffusion models.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>Audio generation: estimated ~60 Wh per minute</li>
                    <li>Energy less intensive than video but more than text/image</li>
                    <li>Evaluated trade-offs between audio quality and energy consumption</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://arxiv.org/html/2505.07615v2" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> ArXiv, 2025
                    </a>
                  </p>
                </div>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #FF9A62' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    EESI - Data Centers & Water Consumption (2024/2025)
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Analysis of data center water usage efficiency across major cloud providers and AI companies.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>Water Usage Efficiency (WUE) varies by provider</li>
                    <li>Industry benchmark: 1.8 L/kWh average</li>
                    <li>Some providers significantly worse than average</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://www.eesi.se/2024/data-centers-water-consumption" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> EESI, 2024/2025
                    </a>
                  </p>
                </div>

                <div className="rounded-lg p-4 mb-6" style={{ borderLeft: '4px solid #60A5FA' }}>
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.primary }}>
                    EPA - Vehicle Emissions Factors
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Standard conversion factors for calculating CO₂ emissions from vehicle travel.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2" style={{ color: COLORS.mutedDark }}>
                    <li>Average passenger vehicle: 0.25 kg CO₂/km</li>
                    <li>Used for equivalency calculations</li>
                    <li>Based on standard vehicle emission testing</li>
                  </ul>
                  <p className="text-xs mt-4">
                    <a href="https://www.epa.gov/greenhouse-gas-emissions-typical-passenger-vehicle" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      <strong>Source:</strong> US Environmental Protection Agency (EPA)
                    </a>
                  </p>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: RGBA.lightGray18, border: '1px solid #E5E7EB' }}>
                  <p className="text-xs text-slate-700">
                    <strong>Note:</strong> Actual environmental impact may vary based on specific AI model, provider, data center efficiency, and local energy grid composition. These calculations are estimates based on best available research data from 2024-2025 and are intended for educational purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </main>

      <footer style={{ backgroundColor: COLORS.white, borderTop: '1px solid #E5E7EB' }} className="mt-auto">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-sm" style={{ color: COLORS.mutedDark }}>
            The Wayfinder Learning Lab • Created by Stephen Taylor (@sjtylr) • AI Environmental Impact Estimator 2026
          </p>
          <p className="text-xs mt-1" style={{ color: COLORS.mutedDark }}>
            To find out more, visit:{' '}
            <a
              href="https://sites.google.com/i-biology.net/ai-footprint-estimator/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://sites.google.com/i-biology.net/ai-footprint-estimator/home
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
