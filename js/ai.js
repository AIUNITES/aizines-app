/**
 * AIZines AI Module
 * Handles AI content generation using Claude API
 */

const AI = {
  /**
   * Make request to Claude API
   */
  async callClaude(prompt, options = {}) {
    const apiKey = Auth.getApiKey();
    
    if (!apiKey) {
      throw new Error('Please add your Claude API key in Settings to use AI features');
    }

    const { 
      maxTokens = 2000,
      temperature = 0.7,
      systemPrompt = 'You are a helpful AI assistant that creates high-quality magazine content.'
    } = options;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Check your internet connection and API key.');
      }
      throw error;
    }
  },

  /**
   * Generate a full article
   */
  async generateArticle(topic, options = {}) {
    const { tone = 'professional', length = 'medium', zineContext = '' } = options;

    const wordCounts = {
      short: '400-600',
      medium: '800-1200',
      long: '1500-2500'
    };

    const prompt = `Write a magazine article about: "${topic}"

Context: ${zineContext || 'A digital magazine for engaged readers'}

Requirements:
- Tone: ${tone}
- Length: ${wordCounts[length]} words
- Format: Start with a compelling hook, use subheadings to organize, end with a takeaway
- Style: Engaging, informative, easy to read
- Do NOT include a title - just the article body

Write the article now:`;

    return await this.callClaude(prompt, {
      maxTokens: length === 'long' ? 4000 : length === 'medium' ? 2500 : 1500,
      systemPrompt: `You are an expert magazine writer who creates compelling, well-researched articles. Your writing is ${tone}, engaging, and provides real value to readers.`
    });
  },

  /**
   * Generate topic ideas
   */
  async generateTopicIdeas(niche, count = 5) {
    const prompt = `Generate ${count} compelling article topic ideas for a ${niche} magazine.

For each topic, provide:
1. A catchy headline/title
2. A one-sentence description of the angle

Format as a numbered list. Make them timely, interesting, and actionable.`;

    return await this.callClaude(prompt, {
      maxTokens: 1000,
      systemPrompt: 'You are an editorial director who comes up with viral, engaging content ideas.'
    });
  },

  /**
   * Improve/rewrite text
   */
  async improveText(text, tone = 'professional') {
    const prompt = `Improve and enhance this text while maintaining its core message. Make it more ${tone}, engaging, and polished.

Original text:
"""
${text}
"""

Provide only the improved version, no explanations:`;

    return await this.callClaude(prompt, {
      maxTokens: Math.max(text.length * 2, 1000),
      systemPrompt: 'You are an expert editor who improves writing while preserving the author\'s voice.'
    });
  },

  /**
   * Generate image prompt for AI image generators
   */
  async generateImagePrompt(articleContent, style = 'photorealistic') {
    const prompt = `Based on this article content, create a detailed prompt for an AI image generator to create a compelling cover/hero image.

Article:
"""
${articleContent.substring(0, 1500)}
"""

Style: ${style}

Generate a single, detailed image prompt (2-3 sentences) that would create a visually striking image. Focus on mood, composition, and specific visual elements. Do not include any text in the image.`;

    return await this.callClaude(prompt, {
      maxTokens: 300,
      systemPrompt: 'You are an art director who creates prompts for AI image generators.'
    });
  },

  /**
   * Generate article summary
   */
  async generateSummary(content, maxLength = 150) {
    const prompt = `Summarize this article in ${maxLength} characters or less. Make it compelling and capture the key point.

Article:
"""
${content}
"""

Summary:`;

    return await this.callClaude(prompt, {
      maxTokens: 200,
      systemPrompt: 'You write concise, compelling summaries.'
    });
  },

  /**
   * Simulate AI response when no API key (for demo purposes)
   */
  async simulateResponse(type, input) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses = {
      article: `## The Rise of ${input}

In today's rapidly evolving landscape, ${input} has emerged as a transformative force that's reshaping how we think about technology and its applications.

### Why This Matters Now

The convergence of several key factors has created the perfect storm for ${input} to take center stage. From advances in computing power to shifting consumer expectations, the groundwork has been laid for unprecedented growth.

**Key drivers include:**
- Increased accessibility of tools and platforms
- Growing demand for efficient solutions
- Maturation of supporting technologies

### What Industry Leaders Are Saying

"We're seeing a fundamental shift in how businesses approach this space," notes one industry expert. "The organizations that adapt quickly will have a significant competitive advantage."

### Looking Ahead

As we move forward, expect to see continued innovation and adoption across sectors. The early movers are already reaping benefits, while laggards risk being left behind.

### Your Action Items

1. Assess your current capabilities
2. Identify quick wins for implementation
3. Build a roadmap for deeper integration

The future belongs to those who embrace change. Is your organization ready?`,

      ideas: `Here are 5 compelling topic ideas:

1. **"The Hidden Cost of Not Adopting AI in 2026"**
   Explore what businesses are losing by waiting on the sidelines.

2. **"From Zero to Published: A 30-Day AI Content Challenge"**
   Document the journey of launching an AI-powered publication.

3. **"5 AI Tools That Replaced My Entire Marketing Team"**
   Real case study of one entrepreneur's automation stack.

4. **"The Ethics of AI-Generated Content: Where Do We Draw the Line?"**
   Thought leadership on transparency and authenticity.

5. **"How I Built a $5K/Month Newsletter Using Only AI"**
   Step-by-step breakdown of a successful AI publication.`,

      improve: `Here's the enhanced version of your text:

${input}

The above has been refined for clarity, flow, and engagement while maintaining your original message and voice.`,

      image: `A striking ${input} composition featuring modern minimalist aesthetics, dramatic lighting with soft gradients, professional color palette with subtle tech-inspired accents, clean geometric shapes suggesting innovation and forward-thinking, cinematic depth of field, 8K resolution quality.`
    };

    return responses[type] || responses.article;
  },

  /**
   * Main generate function - uses API if available, otherwise simulates
   */
  async generate(type, input, options = {}) {
    const apiKey = Auth.getApiKey();

    // If no API key, use simulation for demo
    if (!apiKey) {
      console.log('No API key - using simulated response');
      return await this.simulateResponse(type, input);
    }

    // Use real API
    switch (type) {
      case 'article':
        return await this.generateArticle(input, options);
      case 'ideas':
        return await this.generateTopicIdeas(input, options.count);
      case 'improve':
        return await this.improveText(input, options.tone);
      case 'image':
        return await this.generateImagePrompt(input, options.style);
      case 'summary':
        return await this.generateSummary(input, options.maxLength);
      default:
        throw new Error('Unknown generation type');
    }
  }
};
