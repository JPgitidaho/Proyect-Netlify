pipeline {
  agent any
  environment {
    NETLIFY_AUTH_TOKEN = credentials('netlify_token')
    NETLIFY_SITE_ID    = credentials('netlify_site_id')
    NODE_OPTIONS       = '--max_old_space_size=4096'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Setup Node') {
      steps {
        sh 'node -v || true'
        sh 'corepack enable || npm i -g pnpm'
      }
    }
    stage('Install') {
      steps { sh 'pnpm install --frozen-lockfile || npm ci' }
    }
    stage('Build') {
      steps { sh 'pnpm build || npm run build' }
    }
    stage('Deploy Netlify') {
      steps {
        sh 'npm i -g netlify-cli'
        sh 'netlify deploy --dir=dist --prod --auth="$NETLIFY_AUTH_TOKEN" --site="$NETLIFY_SITE_ID"'
      }
    }
  }
  post {
    always { archiveArtifacts artifacts: 'dist/**', fingerprint: true }
  }
}
