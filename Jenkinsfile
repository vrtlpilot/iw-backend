pipeline {
    agent any
    stages {
        stage('backend master Build') {
            steps {
                echo "Removing old containers if exist........"
                sh 'docker ps -f name=backend -q | xargs -r docker container stop'
                sh 'docker ps -a -f name=backend -q | xargs -r docker container rm'
                sh 'docker images | awk '/backend/{print $3}' | xargs -r docker rmi'
                echo "Building........"
                sh 'docker-compose up -d'
                echo "FINISHED........"
            }
        }
    }
}

