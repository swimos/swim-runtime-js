import java.util.regex.Pattern

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
//            when {
//                anyOf {
//                    branch 'main';
//                    branch pattern: "^\\d+.\\d+.\\d+", comparator: "REGEXP"
//                }
//            }
            steps {
                script {
                    def packageContents = readJSON file: 'package.json'
                    def packageVersion = packageContents['version']
                    def versionRegex = ~"^(\\d+)\\.(\\d+)\\.(\\d+)"

                    def matcher =~ versionRegex

                    if(!matcher.find()) {
                        fail("Could not determine the version from ${packageVersion}")
                    }
                    def major = Integer.parseInt(matcher[1])
                    def minor = Integer.parseInt(matcher[1])
                    def revision = Integer.parseInt(matcher[1])

                    echo "${major}.${minor}.${revision}"



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

