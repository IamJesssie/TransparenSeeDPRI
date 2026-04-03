import { gs } from '@servicenow/glide'
import { GlideDateTime } from '@servicenow/glide'

var AI_Concierge = Class.create()
AI_Concierge.prototype = Object.assign(new AbstractAjaxProcessor(), {
    /**
     * Generate pharmacist safety tip for a drug
     * Params: sysparm_drug_name, sysparm_dpri_price, sysparm_indications
     * Returns: JSON with counsel text or fallback message
     */
    getCounsel: function () {
        var drugName = this.getParameter('sysparm_drug_name') || ''
        var dpriPrice = this.getParameter('sysparm_dpri_price') || '0'
        var indications = this.getParameter('sysparm_indications') || ''

        try {
            // Try to get Gemini API key from system properties
            var apiKey = gs.getProperty('x_1966129_transpar.gemini_api_key') || ''

            if (!apiKey) {
                return JSON.stringify({
                    counsel: this._fallbackCounsel(drugName, dpriPrice),
                    source: 'fallback',
                })
            }

            // Create Gemini API request
            var rm = new sn_ws.RESTMessageV2()
            rm.setEndpoint(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
                    apiKey
            )
            rm.setHttpMethod('POST')
            rm.setRequestHeader('Content-Type', 'application/json')

            var prompt = this._buildPrompt(drugName, dpriPrice, indications)
            var requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    maxOutputTokens: 200,
                },
            }

            rm.setRequestBody(JSON.stringify(requestBody))

            var response = rm.execute()
            var statusCode = response.getStatusCode()

            if (statusCode === 200) {
                var responseBody = JSON.parse(response.getBody())
                if (
                    responseBody.candidates &&
                    responseBody.candidates[0] &&
                    responseBody.candidates[0].content &&
                    responseBody.candidates[0].content.parts[0]
                ) {
                    var aiCounsel = responseBody.candidates[0].content.parts[0].text
                    return JSON.stringify({
                        counsel: aiCounsel,
                        source: 'ai',
                    })
                }
            }

            // If AI fails, return fallback
            return JSON.stringify({
                counsel: this._fallbackCounsel(drugName, dpriPrice),
                source: 'fallback',
            })
        } catch (e) {
            gs.error('AI_Concierge getCounsel error: ' + e.message)
            return JSON.stringify({
                counsel: this._fallbackCounsel(drugName, dpriPrice),
                source: 'error',
            })
        }
    },

    /**
     * Answer specific questions about a drug
     * Params: sysparm_drug_name, sysparm_question
     */
    answerQuestion: function () {
        var drugName = this.getParameter('sysparm_drug_name') || ''
        var question = this.getParameter('sysparm_question') || ''

        try {
            var apiKey = gs.getProperty('x_1966129_transpar.gemini_api_key') || ''

            if (!apiKey || !question) {
                return JSON.stringify({
                    answer:
                        'I apologize, but I cannot answer questions at this time. Please consult your pharmacist or doctor for specific medical advice about ' +
                        drugName +
                        '.',
                })
            }

            var rm = new sn_ws.RESTMessageV2()
            rm.setEndpoint(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
                    apiKey
            )
            rm.setHttpMethod('POST')
            rm.setRequestHeader('Content-Type', 'application/json')

            var prompt =
                'You are a helpful Filipino pharmacist assistant. Answer this question about ' +
                drugName +
                ' in 1-2 sentences using simple language: "' +
                question +
                '"' +
                ' Always remind patients to consult their doctor for personalized advice.'

            var requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 150,
                },
            }

            rm.setRequestBody(JSON.stringify(requestBody))
            var response = rm.execute()

            if (response.getStatusCode() === 200) {
                var responseBody = JSON.parse(response.getBody())
                if (
                    responseBody.candidates &&
                    responseBody.candidates[0] &&
                    responseBody.candidates[0].content &&
                    responseBody.candidates[0].content.parts[0]
                ) {
                    return JSON.stringify({
                        answer: responseBody.candidates[0].content.parts[0].text,
                    })
                }
            }

            return JSON.stringify({
                answer:
                    'I cannot answer that question right now. Please consult your pharmacist or doctor for information about ' +
                    drugName +
                    '.',
            })
        } catch (e) {
            gs.error('AI_Concierge answerQuestion error: ' + e.message)
            return JSON.stringify({
                answer:
                    'Sorry, I cannot process your question at the moment. Please ask your pharmacist for guidance on ' +
                    drugName +
                    '.',
            })
        }
    },

    /**
     * Build the main prompt for drug counsel
     */
    _buildPrompt: function (drugName, dpriPrice, indications) {
        return (
            'You are a helpful Filipino pharmacist assistant in the Philippines. ' +
            'In 2-3 short sentences using simple English or Taglish (Filipino-English mix), ' +
            'explain what ' +
            drugName +
            ' is used for and give one important safety tip. ' +
            'Also mention that the government fair price (DPRI 2025) is ₱' +
            dpriPrice +
            '. ' +
            'Keep it friendly, simple, and reassuring for ordinary Filipino patients. ' +
            'Drug information: ' +
            indications +
            '. ' +
            "Always remind them to follow their doctor's instructions."
        )
    },

    /**
     * Fallback counsel when AI is not available
     */
    _fallbackCounsel: function (drugName, dpriPrice) {
        var counsel =
            '💊 The government-set fair price (DPRI 2025) for ' +
            drugName +
            ' is ₱' +
            dpriPrice +
            ". Always follow your doctor's prescription " +
            'and take the full course as directed. ⚠️ If you experience side effects, ' +
            'consult your pharmacist or doctor immediately. 🏥 Never exceed the recommended dosage.'
        return counsel
    },

    /**
     * Test AI connection (for admin purposes)
     */
    testConnection: function () {
        try {
            var apiKey = gs.getProperty('x_1966129_transpar.gemini_api_key') || ''
            if (!apiKey) {
                return JSON.stringify({
                    status: 'error',
                    message: 'API key not configured. Please set system property: x_1966129_transpar.gemini_api_key',
                })
            }

            var rm = new sn_ws.RESTMessageV2()
            rm.setEndpoint(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
                    apiKey
            )
            rm.setHttpMethod('POST')
            rm.setRequestHeader('Content-Type', 'application/json')

            var requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: 'Say "AI Concierge connected successfully" in Filipino.',
                            },
                        ],
                    },
                ],
            }

            rm.setRequestBody(JSON.stringify(requestBody))
            var response = rm.execute()

            if (response.getStatusCode() === 200) {
                return JSON.stringify({
                    status: 'success',
                    message: 'AI Concierge is working properly',
                    timestamp: new GlideDateTime().getDisplayValue(),
                })
            } else {
                return JSON.stringify({
                    status: 'error',
                    message: 'API call failed with status: ' + response.getStatusCode(),
                })
            }
        } catch (e) {
            return JSON.stringify({
                status: 'error',
                message: 'Connection test failed: ' + e.message,
            })
        }
    },

    type: 'AI_Concierge',
})
