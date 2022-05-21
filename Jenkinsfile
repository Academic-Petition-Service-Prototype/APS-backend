pipeline {
    agent any

    stages {
        
        stage('Git Clone') {
            steps {
                cleanWs()
                git branch: 'main',url: 'https://github.com/Academic-Petition-Service-Prototype/APS-backend.git'
                sh 'cp /var/lib/jenkins/workspace/env/backend.env ./.env'
            }
        }

        
        stage('Docker PreBuild Clear old image') {
            steps {
                sh 'docker stop backend || true && docker rm backend || true'
                sh 'docker image rm backend || true'
            }
        }
        
        stage('Docker Build') {
            steps {
                sh 'sudo docker build . -t backend'
            }
        }
        
        stage('Docker Deploy') {
            steps {
                sh 'docker run -p 3000:3000/tcp --restart=always -d --name backend backend:latest'
            }
        }
        
    }
}
