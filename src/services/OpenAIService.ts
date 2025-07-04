import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.openai,
})

export class OpenAIService {
  static async analyzeCustomerData(customerData: any): Promise<{
    confidence_score: number
    anomaly_detected: boolean
    risk_level: 'low' | 'medium' | 'high'
    recommendations: string[]
  }> {
    try {
      const prompt = `
        تحليل بيانات العميل التالية وتقييم المخاطر:
        
        الاسم: ${customerData.full_name || 'غير محدد'}
        الهاتف: ${customerData.phone_number || 'غير محدد'}
        البريد الإلكتروني: ${customerData.email || 'غير محدد'}
        العنوان: ${customerData.address || 'غير محدد'}
        الجنسية: ${customerData.nationality || 'غير محدد'}
        رخصة القيادة: ${customerData.driver_license || 'غير محدد'}
        
        يرجى تحليل البيانات وتقديم:
        1. نقاط الثقة (0-100)
        2. هل تم اكتشاف شذوذ؟
        3. مستوى المخاطر (منخفض/متوسط/عالي)
        4. التوصيات
        
        الرد يجب أن يكون بصيغة JSON فقط.
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'أنت محلل بيانات خبير في تقييم مخاطر العملاء. قدم ردودك بصيغة JSON صحيحة فقط.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      try {
        return JSON.parse(content)
      } catch (parseError) {
        return {
          confidence_score: 75,
          anomaly_detected: false,
          risk_level: 'low' as const,
          recommendations: ['تحليل تلقائي - البيانات تبدو طبيعية']
        }
      }
    } catch (error) {
      console.error('Error analyzing customer data:', error)
      return {
        confidence_score: 50,
        anomaly_detected: false,
        risk_level: 'medium' as const,
        recommendations: ['فشل في التحليل - يحتاج مراجعة يدوية']
      }
    }
  }

  static async analyzePaymentPattern(payments: any[]): Promise<{
    pattern_analysis: string
    risk_score: number
    anomalies: string[]
    recommendations: string[]
  }> {
    try {
      const prompt = `
        تحليل نمط المدفوعات التالي:
        
        ${JSON.stringify(payments, null, 2)}
        
        يرجى تحليل النمط وتقديم:
        1. تحليل النمط
        2. نقاط المخاطر (0-100)
        3. الشذوذات المكتشفة
        4. التوصيات
        
        الرد يجب أن يكون بصيغة JSON فقط.
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'أنت محلل مدفوعات خبير. قدم ردودك بصيغة JSON صحيحة فقط.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 600
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      try {
        return JSON.parse(content)
      } catch (parseError) {
        return {
          pattern_analysis: 'تحليل تلقائي للمدفوعات',
          risk_score: 25,
          anomalies: [],
          recommendations: ['نمط دفع طبيعي']
        }
      }
    } catch (error) {
      console.error('Error analyzing payment pattern:', error)
      return {
        pattern_analysis: 'فشل في التحليل',
        risk_score: 50,
        anomalies: ['فشل في التحليل'],
        recommendations: ['يحتاج مراجعة يدوية']
      }
    }
  }

  static async extractDocumentData(documentUrl: string): Promise<{
    extracted_fields: Record<string, any>
    confidence_score: number
    verification_status: 'verified' | 'needs_review' | 'rejected'
    notes: string[]
  }> {
    try {
      const prompt = `
        تحليل الوثيقة في الرابط التالي واستخراج البيانات:
        ${documentUrl}
        
        يرجى استخراج:
        1. الحقول المهمة (الاسم، الرقم، التاريخ، إلخ)
        2. نقاط الثقة (0-100)
        3. حالة التحقق
        4. ملاحظات
        
        الرد يجب أن يكون بصيغة JSON فقط.
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: 'أنت محلل وثائق خبير. قدم ردودك بصيغة JSON صحيحة فقط.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      try {
        return JSON.parse(content)
      } catch (parseError) {
        return {
          extracted_fields: {},
          confidence_score: 0,
          verification_status: 'needs_review' as const,
          notes: ['فشل في استخراج البيانات']
        }
      }
    } catch (error) {
      console.error('Error extracting document data:', error)
      return {
        extracted_fields: {},
        confidence_score: 0,
        verification_status: 'needs_review' as const,
        notes: ['فشل في تحليل الوثيقة']
      }
    }
  }

  static async generateRecommendations(customerData: any, context: string): Promise<{
    recommendations: string[]
    priority: 'low' | 'medium' | 'high'
    action_items: string[]
  }> {
    try {
      const prompt = `
        بناءً على بيانات العميل والسياق التالي، قدم توصيات:
        
        بيانات العميل: ${JSON.stringify(customerData, null, 2)}
        السياق: ${context}
        
        يرجى تقديم:
        1. التوصيات
        2. الأولوية
        3. عناصر العمل
        
        الرد يجب أن يكون بصيغة JSON فقط.
      `

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'أنت مستشار أعمال خبير في إدارة العملاء. قدم ردودك بصيغة JSON صحيحة فقط.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 600
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      try {
        return JSON.parse(content)
      } catch (parseError) {
        return {
          recommendations: ['مراجعة عامة للحساب'],
          priority: 'medium' as const,
          action_items: ['تحديث البيانات']
        }
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return {
        recommendations: ['فشل في إنشاء التوصيات'],
        priority: 'low' as const,
        action_items: ['مراجعة يدوية']
      }
    }
  }
}
