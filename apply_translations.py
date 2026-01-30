#!/usr/bin/env python3
"""
Script to apply translations to AI Environmental Impact Estimator
"""

import re

# Read original file
with open('/home/z/my-project/src/app/page.tsx', 'r') as f:
    content = f.read()

# Dictionary of strings to replace with their translation keys
replacements = [
    # About section
    (r"'About This App'", r"t('aboutApp')"),
    (r"This tool helps students estimate and visualise environmental impacts of using AI.", r"t('aboutText1')"),
    (r"The calculator uses average electricity grid impacts and most popular AI models to provide estimates.", r"t('aboutText2')"),
    (r"⚠️ This app is for demonstration only.", r"t('aboutText3')"),
    
    # Task inputs
    (r"'AI Task Inputs'", r"t('aiTaskInputs')"),
    (r"'Calculate Impact'", r"t('calculateImpact')"),
    (r"'Reset'", r"t('reset')"),
    
    # Results
    (r"'Environmental Impact Results'", r"t('environmentalImpactResults')"),
    (r"'Energy Used'", r"t('energyUsed')"),
    (r"'Carbon Emissions'", r"t('carbonEmissions')"),
    (r"'Water Used'", r"t('waterUsed')"),
    (r"'km Driven'", r"t('kmDriven')"),
    (r"'Miles Driven'", r"t('milesDriven')"),
    (r"'Switch to Miles'", r"t('switchToMiles')"),
    (r"'Switch to km'", r"t('switchToKm')"),
    
    # Equivalencies
    (r"'Impact Equivalencies'", r"t('impactEquivalencies')"),
    (r"'Tree Offset'", r"t('treeOffset')"),
    (r"'Phone Charges'", r"t('phoneCharges')"),
    (r"'Full smartphone charges'", r"t('fullSmartphoneCharges')"),
    (r"'Showers'", r"t('showers')"),
    (r"'Average showers \\(65L\\)'", r"t('averageShowers')"),
    (r"'Lightbulb Hours'", r"t('lightbulbHours')"),
    (r"'LED bulb hours'", r"t('ledBulbHours')"),
    
    # Charts and breakdown
    (r"'Relative Impact by AI Task Type'", r"t('relativeImpactByTask')"),
    (r"'Show: Carbon \\(kg CO₂\\)'", r"t('showCarbon')"),
    (r"'Show: Energy \\(kWh\\)'", r"t('showEnergy')"),
    (r"'Breakdown:'", r"t('breakdown')"),
    (r"This chart shows the relative energy usage \\(kWh\\) or carbon impact \\(kg CO₂\\) of each AI task type.", r"t('breakdownText')"),
    
    # Understanding AI Impact
    (r"'Understanding AI Environmental Impact'", r"t('understandingAiImpact')"),
    (r"'Where are you\\?'", r"t('whereAreYou')"),
    (r"Select: type of energy grid in your region to better understand your potential impact:", r"t('whereDesc')"),
    (r"'What AI models are you using\\?'", r"t('whatAiModels')"),
    (r"AI model efficiency has a major impact on environmental footprint. Newer, more efficient models can reduce impact by 5-10x:", r"t('whatAiDesc')"),
    
    # Grid types
    (r"'Clean Grid'", r"t('cleanGrid')"),
    (r"Examples: Norway, Iceland, France \\(15 gCO₂/kWh\\)", r"t('cleanExamples')"),
    (r"Impact: Lowest emissions if AI is hosted locally", r"t('cleanImpact')"),
    (r"'Renewable Heavy'", r"t('renewableHeavy')"),
    (r"Examples: Denmark, EU average \\(150 gCO₂/kWh\\)", r"t('renewableExamples')"),
    (r"Impact: High renewables, but fossil backup for reliability", r"t('renewableImpact')"),
    (r"'Mixed Grid \\(Default\\)'", r"t('mixedGrid')"),
    (r"Examples: Global average, US \\(450 gCO₂/kWh\\)", r"t('mixedExamples')"),
    (r"Impact: Average of different grid types - reasonable default for estimation", r"t('mixedImpact')"),
    (r"'Coal-Heavy'", r"t('coalHeavy')"),
    (r"Examples: Poland, China \\(650 gCO₂/kWh\\)", r"t('coalExamples')"),
    (r"Impact: Highest emissions - common in rapidly growing AI markets", r"t('coalImpact')"),
    
    # AI Model efficiency
    (r"'Locally Hosted'", r"t('locallyHosted')"),
    (r"Examples: Ollama, Mistral, DeepSeek, Qwen running locally on your hardware", r"t('localExamples')"),
    (r"Impact: Can use clean energy, but depends heavily on your local power source", r"t('localImpact')"),
    (r"'Less Efficient'", r"t('lessEfficient')"),
    (r"Examples: Standard GPT-4, Claude 3 Opus - baseline models", r"t('lessExamples')"),
    (r"Impact: Higher energy consumption per task", r"t('lessImpact')"),
    (r"'More Efficient'", r"t('moreEfficient')"),
    (r"Examples: GPT-4o, Claude 3.5 Sonnet - optimized models", r"t('moreExamples')"),
    (r"Impact: ~70% less energy than baseline", r"t('moreImpact')"),
    
    # Input labels
    (r"'Time-Based Projections'", r"t('timeBasedProjections')"),
    (r"'Projections'", r"t('projections')"),
    (r"'If you use AI daily, over:'", r"t('ifYouDaily')"),
    (r"'1 week'", r"t('week')"),
    (r"'1 month'", r"t('month')"),
    (r"'1 semester \\(140 days\\)'", r"t('semester')"),
    (r"'Total Energy'", r"t('totalEnergyProj')"),
    (r"'Total Carbon'", r"t('totalCarbonProj')"),
    (r"'driven'", r"t('drivenProj')"),
    (r"'tree months offset needed'", r"t('treeOffsetProj')"),
    (r"'charges'", r"t('chargesProj')"),
    (r"'showers'", r"t('showersProj')"),
    (r"'lightbulb hours'", r"t('lightbulbProj')"),
    
    # Stacked bar
    (r"'Relative Impact Breakdown'", r"t('relativeImpactBreakdown')"),
    (r"'Proportional breakdown of your AI energy usage'", r"t('proportionalBreakdown')"),
    (r"by task type", r"t('proportionalText')"),
    
    # Methodology
    (r"'Calculation Methodology'", r"t('calculationMethodology')"),
    (r"'Energy Calculations'", r"t('energyCalculations')"),
    (r"'Carbon Emissions'", r"t('carbonEmissionsTitle')"),
    (r"'Water Usage'", r"t('waterUsageTitle')"),
]

# Apply replacements
for old_str, new_str in replacements:
    content = content.replace(old_str, new_str)

# Write back
with open('/home/z/my-project/src/app/page.tsx', 'w') as f:
    f.write(content)

print("Translations applied successfully!")
