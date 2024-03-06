pipeline {
    agent any

    stages {
        stage('Build Client') {
            steps {
                sh 'docker build -t client-image -f client/Dockerfile .'
            }
        }
        stage('Build Server') {
            steps {
                sh 'docker build -t server-image -f server/Dockerfile .'
            }
        }
        stage('Build MongoDB') {
            steps {
                sh 'docker build -t mongo-image -f mongo/Dockerfile .'
            }
        }
        stage('Build Nginx') {
            steps {
                sh 'docker build -t nginx-image -f nginx/Dockerfile .'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
