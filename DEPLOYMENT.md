# 🚀 Deployment Guide - ElectBot

## Overview

This guide covers deploying ElectBot to production environments.

## 📋 Pre-Deployment Checklist

- [ ] Google Gemini API key obtained
- [ ] MongoDB instance configured (optional)
- [ ] Redis instance configured (optional)
- [ ] Environment variables ready
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate ready (for HTTPS)

## 🔧 Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
heroku login
cd backend
heroku create your-electbot-api
```

3. **Set Environment Variables**
```bash
heroku config:set GEMINI_API_KEY=your_key
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set REDIS_URL=your_redis_url
```

4. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 2: Railway

1. **Connect GitHub Repository**
2. **Create New Project**
3. **Select backend directory**
4. **Add Environment Variables** in Railway dashboard
5. **Deploy automatically**

### Option 3: Render

1. **Create Web Service**
2. **Connect GitHub repository**
3. **Set Build Command**: `cd backend && npm install`
4. **Set Start Command**: `cd backend && npm start`
5. **Add Environment Variables**
6. **Deploy**

### Option 4: DigitalOcean/AWS/Azure

1. **Create VPS/EC2 Instance**
2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone Repository**
```bash
git clone your-repo-url
cd election-assistant/backend
```

4. **Install Dependencies**
```bash
npm install --production
```

5. **Create .env File**
```bash
nano .env
# Add your environment variables
```

6. **Install PM2**
```bash
sudo npm install -g pm2
```

7. **Start Application**
```bash
pm2 start src/app.js --name electbot-api
pm2 startup
pm2 save
```

8. **Configure Nginx (optional)**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build and Deploy**
```bash
cd frontend
vercel
```

3. **Set Environment Variables** in Vercel dashboard
```env
VITE_API_URL=https://your-backend-url.com/api
```

4. **Redeploy**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Build the Project**
```bash
cd frontend
npm run build
```

2. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

3. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

4. **Set Environment Variables** in Netlify dashboard

### Option 3: GitHub Pages

1. **Update vite.config.js**
```javascript
export default {
  base: '/your-repo-name/',
}
```

2. **Build**
```bash
npm run build
```

3. **Install gh-pages**
```bash
npm install -D gh-pages
```

4. **Add to package.json**
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

5. **Deploy**
```bash
npm run deploy
```

### Option 4: Custom Server

1. **Build the Project**
```bash
cd frontend
npm run build
```

2. **Serve with Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/election-assistant/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Security Considerations

### Backend
- Set `NODE_ENV=production`
- Use strong API keys
- Enable CORS only for your frontend domain
- Use HTTPS in production
- Keep dependencies updated
- Implement rate limiting
- Monitor logs regularly

### Frontend
- Use HTTPS
- Set proper CORS headers
- Sanitize user inputs
- Keep dependencies updated
- Use environment variables for sensitive data

## 📊 Monitoring

### Backend Monitoring
- Use PM2 for process management
- Set up error logging (Winston)
- Monitor API response times
- Track error rates
- Use health check endpoint

### Frontend Monitoring
- Google Analytics (optional)
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-electbot-api"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          working-directory: ./frontend
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account** at mongodb.com/cloud/atlas
2. **Create Cluster**
3. **Whitelist IP** (0.0.0.0/0 for all IPs)
4. **Create Database User**
5. **Get Connection String**
6. **Set MONGODB_URI** environment variable

### Redis Cloud

1. **Create Account** at redis.com/cloud
2. **Create Database**
3. **Get Connection String**
4. **Set REDIS_URL** environment variable

## 🧪 Testing Production Build

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Post-Deployment

- [ ] Test all features in production
- [ ] Verify API endpoints work
- [ ] Check HTTPS is working
- [ ] Test on multiple devices
- [ ] Monitor error logs
- [ ] Set up backups
- [ ] Configure domain DNS
- [ ] Add to search engines (optional)

## 🆘 Troubleshooting

### API Not Connecting
- Check CORS settings
- Verify API URL in frontend .env
- Check firewall rules
- Verify SSL certificates

### Voice Input Not Working
- Ensure HTTPS is enabled
- Check browser permissions
- Verify microphone access

### Build Failures
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify environment variables

## 📞 Support

For deployment issues, check:
- GitHub Issues
- README.md
- CONTRIBUTING.md

---

**Happy Deploying! 🚀**
