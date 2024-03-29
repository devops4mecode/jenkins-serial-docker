pipeline {
    agent any

    environment {
        // Define any global environment variables here
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
                // Add any wait or health check script to ensure server is up
            }
        }

        stage('Deploy Client') {
            steps {
                sh "${env.DOCKER_COMPOSE_V3} up -d nginx"
                // Add any validation steps to ensure client is accessible
            }
        }
    }

    post {
        always {
            // This input step will pause the pipeline and wait for user input
            script {
                def userInput = input(
                    id: 'confirmDown', message: 'Take down the services?', parameters: [
                    [$class: 'BooleanParameterDefinition', defaultValue: true, description: 'Check to take down the services', name: 'confirm']
                ])
                
                if (userInput) {
                    // If the user provides input to proceed, take down the services
                    sh "${env.DOCKER_COMPOSE_V3} down"
                }
            }
        }
    }
}
