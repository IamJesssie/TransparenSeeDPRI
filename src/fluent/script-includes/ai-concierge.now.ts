import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['ai_concierge'],
    name: 'AI_Concierge',
    description: 'AI-powered pharmacist concierge using Gemini API for drug safety counsel',
    clientCallable: true,
    script: Now.include('./../../server/script-includes/ai-concierge.js'),
    apiName: 'x_1966129_transpar.AI_Concierge',
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
