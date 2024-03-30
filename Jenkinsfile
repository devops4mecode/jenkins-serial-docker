pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_V3 = 'docker-compose -f docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy Mongo') {
            steps {
                sh "${env.DOCKER_COMPOSE_V3} up -d mongo"
            }
        }

        stage('Deploy Server') {
            steps {
                sh "${env.DOCKER_COMPOSE_V3} up -d server"
                // Implement a health check here
            }
        }

        stage('Deploy Client') {
            steps {
                sh "${env.DOCKER_COMPOSE_V3} build nginx"
                sh "${env.DOCKER_COMPOSE_V3} up -d nginx"
                // Implement client accessibility checks here
            }
        }
    }

    post {
        always {
            script {
                def userInput = input(
                    id: 'confirmDown', message: 'Take down the services?', parameters: [
                    [$class: 'BooleanParameterDefinition', defaultValue: true, description: 'Check to take down the services', name: 'confirm']
                ])
                
                if (userInput) {
                    sh "${env.DOCKER_COMPOSE_V3} down"
                }
            }
        }
    }
}
