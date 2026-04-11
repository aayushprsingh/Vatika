import { NextRequest, NextResponse } from 'next/server';
import { getPlantInsights } from '@/app/services/ai.service'; // Adjust path if necessary

export async function POST(req: NextRequest) {
  // return NextResponse.json({ error: 'Simulated AI service is down for testing.' }, { status: 500 });
  try {
    const body = await req.json();
    const { name, scientificName } = body;

    if (!name || !scientificName) {
      return NextResponse.json({ error: 'Plant name and scientificName are required' }, { status: 400 });
    }

    // Call the AI service to get plant insights
    const insights = await getPlantInsights({ name, scientificName });

    if (!insights) {
      return NextResponse.json({ error: 'Failed to retrieve plant insights from AI service' }, { status: 500 });
    }

    // Transform the data to match the PlantInsights interface on the frontend
    // Expected by frontend: { traditionalUses: string; modernResearch: string; safetyConsiderations: string; }
    // From ai.service.ts (getPlantInsights -> getPlantDetails prompt):
    // {
    //   "traditionalUses": ["use1", "use2"],
    //   "scientificResearch": ["finding1", "finding2"],
    //   "preparation": {
    //     "methods": ["method1", "method2"],
    //     "dosage": "dosage information",
    //     "precautions": ["precaution1", "precaution2"]
    //   },
    //   "interactions": ["interaction1", "interaction2"],
    //   "historicalUse": "brief history",
    //   "modernApplications": ["application1", "application2"]
    // }

    const transformedInsights = {
      traditionalUses: insights.traditionalUses?.join?.(', ') || 'No traditional uses information available.',
      modernResearch: insights.scientificResearch?.join?.(', ') || 'No modern research information available.',
      safetyConsiderations: [
        ...(insights.preparation?.precautions || []),
        ...(insights.interactions || [])
      ].join('; ') || 'No specific safety considerations available. Always consult a healthcare professional.'
    };

    return NextResponse.json(transformedInsights);

  } catch (error: any) {
    console.error('Error in /api/plant-insights:', error);
    // Check if the error is from the AI service and has a specific message
    if (error.message && error.message.includes('generation failed')) {
        return NextResponse.json({ error: `AI service error: ${error.message}` }, { status: 502 }); // Bad Gateway
    }
    return NextResponse.json({ error: 'An unexpected error occurred while fetching plant insights.' }, { status: 500 });
  }
}
