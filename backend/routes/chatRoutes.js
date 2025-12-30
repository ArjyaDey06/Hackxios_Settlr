import express from 'express';
import { chatWithAI } from '../services/openRouterService.js';
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import { searchProperties, formatPropertiesForAI, extractSearchCriteria } from '../services/propertySearchService.js';

const router = express.Router();

const SETTLR_SYSTEM_PROMPT = `You are Settlr AI, an expert rental property assistant.

**CRITICAL INSTRUCTIONS:**
- Present REAL properties from the database with ALL details
- Use markdown formatting for better readability
- Be conversational and helpful
- If no properties found, suggest adjusting filters

Keep responses friendly and under 400 words.`;

router.post('/chat', verifyFirebaseToken, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid messages format' });
    }

    const latestMessage = messages[messages.length - 1];
    console.log('\n💬 User message:', latestMessage.content);

    // Extract search criteria using flexible extractor
    const searchCriteria = extractSearchCriteria(latestMessage.content);
    console.log('🔍 Extracted criteria:', searchCriteria);

    let propertyContext = '';
    let propertiesFound = 0;

    // Check if this is a property search
    const isPropertySearch = Object.values(searchCriteria).some(v => 
      v !== null && v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
    );

    if (isPropertySearch) {
      console.log('🏠 Searching properties...');
      
      try {
        const result = await searchProperties(searchCriteria, {
          limit: 10,
          sort: { createdAt: -1 },
          includeUnverified: true // Include pending properties
        });
        
        propertiesFound = result.properties.length;
        console.log(`📊 Found ${propertiesFound} properties (${result.total} total)`);
        
        if (result.properties.length > 0) {
          const formattedProperties = formatPropertiesForAI(result.properties, 'markdown');
          propertyContext = `\n\n===== REAL PROPERTIES FROM SETTLR =====\n${formattedProperties}\n===== END =====\n\nPresent these ${result.properties.length} properties to the user in a friendly way.`;
        } else {
          propertyContext = '\n\n===== NO PROPERTIES FOUND =====\nSuggest the user to:\n1. Adjust budget\n2. Try nearby areas\n3. Modify other criteria';
        }
      } catch (searchError) {
        console.error('❌ Search error:', searchError);
      }
    }

    // Build enhanced messages
    const enhancedMessages = [...messages];
    
    if (propertyContext) {
      enhancedMessages[enhancedMessages.length - 1] = {
        ...latestMessage,
        content: latestMessage.content + propertyContext
      };
    }

    // Add system message
    if (enhancedMessages[0]?.role !== 'system') {
      enhancedMessages.unshift({
        role: 'system',
        content: SETTLR_SYSTEM_PROMPT
      });
    }

    console.log('🤖 Sending to AI...');
    const response = await chatWithAI(enhancedMessages);
    console.log('✅ AI response received\n');

    res.json({
      success: true,
      message: response,
      propertiesFound: propertiesFound,
        properties: result?.properties || [],
      searchCriteria: searchCriteria,
      model: 'deepseek/deepseek-r1-distill-llama-70b'
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get AI response',
      error: error.message 
    });
  }
});

export default router;
