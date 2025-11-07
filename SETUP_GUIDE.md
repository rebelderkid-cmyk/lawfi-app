# LawFI Setup Guide

Your AI legal consultation platform is ready! Follow these final steps to make it fully functional.

## ✅ What's Already Done

- ✅ Next.js project created
- ✅ Beautiful home page with LawFI branding
- ✅ Professional chat interface
- ✅ Claude AI integration code
- ✅ Streaming responses for smooth UX
- ✅ Legal disclaimers throughout
- ✅ Responsive design (works on mobile & desktop)

## 🔑 Final Step: Add Your Anthropic API Key

To make the AI work, you need an API key from Anthropic (the company that makes Claude).

### Step 1: Get Your API Key

1. **Go to:** https://console.anthropic.com/
2. **Sign up** for an Anthropic account (it's free to start)
3. **Click** on "API Keys" in the left sidebar
4. **Click** "Create Key"
5. **Copy** the API key (it starts with `sk-ant-`)

### Step 2: Add It to Your Project

1. **Open** the file: `lawfi-app/.env.local`
2. **Replace** `your_api_key_here` with your actual API key
3. **Save** the file

It should look like this:
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart the Server

The server needs to restart to load the new API key:

1. **Stop** the current server (press `Ctrl+C` in the terminal)
2. **Run** `npm run dev` again
3. **Go to** http://localhost:3000/chat
4. **Ask** a legal question and watch Claude respond!

## 💰 Anthropic Pricing

- **Free tier:** $5 in free credits
- **After that:** Pay-as-you-go (about $0.003 per message)
- **For testing:** The free credits are plenty!

## 🧪 Testing Your Platform

Once your API key is added:

1. **Go to:** http://localhost:3000 (home page)
2. **Click:** "Start Free Consultation"
3. **Try asking:**
   - "What are my rights if I'm being sued?"
   - "How do I file a small claims case?"
   - "What documents do I need for a divorce?"

You should see Claude respond with helpful legal information!

## 📂 Project Structure

```
lawfi-app/
├── app/
│   ├── page.tsx              # Home page
│   ├── chat/
│   │   └── page.tsx          # Chat interface
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # API endpoint for Claude
│   ├── layout.tsx            # App layout
│   └── globals.css           # Global styles
├── .env.local                # Your API key (SECRET - never share!)
├── .env.example              # Example env file
├── package.json              # Dependencies
└── SETUP_GUIDE.md           # This file
```

## 🚀 What You Can Do Next

### Immediate Next Steps:
1. **Test thoroughly** - Try different types of legal questions
2. **Customize the styling** - Change colors, fonts, layout
3. **Adjust the AI behavior** - Edit the system prompt in `app/api/chat/route.ts`

### Future Enhancements (from LEARNING_PATH.md):
1. **User accounts** - Let users save their chat history
2. **Case types** - Add specific guidance for different legal cases
3. **Document upload** - Allow users to upload legal documents
4. **Case timeline builder** - Help users track their case progress
5. **Lawyer referrals** - Connect users with real attorneys

## 🛠️ Common Issues

### Issue: "Anthropic API key not configured"
**Solution:** Make sure you added your API key to `.env.local` and restarted the server

### Issue: Page shows errors in browser
**Solution:** Open the browser console (F12) and share the error message with me

### Issue: AI responses are too long/short
**Solution:** Adjust `max_tokens` in `app/api/chat/route.ts` (currently 4096)

### Issue: AI is too creative/inconsistent
**Solution:** Increase `temperature` in `app/api/chat/route.ts` (currently 0.4, max is 1.0)

## 📝 Development Commands

```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm run start      # Run production build
npm run lint       # Check code quality
```

## 🔒 Security Reminders

1. **NEVER** commit `.env.local` to git (it's in `.gitignore`)
2. **NEVER** share your API key publicly
3. **NEVER** put API keys in your frontend code
4. If you accidentally expose your key, **delete it immediately** in the Anthropic console

## ✨ Congratulations!

You've built a fully functional AI-powered legal consultation platform! This is a significant achievement, especially if you're new to coding.

### What You've Learned:
- Next.js and React basics
- API integration
- Streaming responses
- Environment variables
- TypeScript
- Tailwind CSS
- Building a production-ready web app

### Next Steps:
- Keep practicing and adding features
- Read through the code to understand how it works
- Experiment with changes
- Ask questions when you're stuck!

---

**Need help?** Ask Claude Code: "Explain how [feature] works" or "Help me add [new feature]"
