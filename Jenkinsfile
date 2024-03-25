pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // stage('Build') {
        //     steps {
        //         sh 'docker-compose build'
        //     }
        // }

        // stage('Unit Tests') {
        //     steps {
        //         // Add commands to run your unit tests here
        //     }
        // }

        // stage('Integration Tests') {
        //     steps {
        //         // Add commands to run your integration tests here
        //     }
        // }

        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
    // post {
    //     always {
    //         // This will ensure that Jenkins cleans up all the Docker containers and networks after the pipeline runs
    //         sh 'docker-compose down -v'
    //     }
    // }
}
