pipeline {
    options {
        timeout(time: 1, unit: 'HOURS')
    }
    agent {
        kubernetes {
            cloud 'kubernetes'
            inheritFrom 'default'
            yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: node
            image: node:20
            command:
            - cat
            tty: true                 
        '''
        }
    }

    environment {
        NO_COLOR = "false"
    }

    stages {
        stage('version') {
            steps {
                script {
                    def packageVersion = readJSON file: 'package.json'
                    echo packageVersion['version']
                }
            }



        }

        stage('build') {
            steps {
                container('node') {
                    sh 'npm config set color false'
                    sh 'npm install'
                    sh 'npm run bootstrap'
                    sh 'npx swim-build'
                }
            }
        }
    }
}

