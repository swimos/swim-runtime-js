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
        stage('read-version') {
            steps {
                script {
                    def packageContents = readJSON file: 'package.json'
                    def packageVersion = packageContents['version']

                    def matcher = (packageVersion =~ /^(\d+)\.(\d+)\.(\d+)/)

                    if(!matcher) {
                        fail("Could not determine the version from ${packageVersion}")
                    }
                    echo matcher.toString()

                    //def means local variable. Removing means global.
                    version_major = Integer.parseInt(matcher[0][1])
                    version_minor = Integer.parseInt(matcher[0][2])
                    version_revision = Integer.parseInt(matcher[0][3])

                    echo "${version_major}.${version_minor}.${version_revision}"
                }
            }
        }

        stage('modify-version') {
            when {
                anyOf {
                    branch 'main';
                    branch pattern: "^\\d+.\\d+.\\d+", comparator: "REGEXP"
                }
            }
            steps {
                script {
                    def packageContents = readJSON file: 'package.json'
                    def packageVersion = packageContents['version']
                    def versionRegex = ~"^(\\d+)\\.(\\d+)\\.(\\d+)"

                    def matcher = (packageVersion =~ /^(\d+)\.(\d+)\.(\d+)/)

                    if(!matcher) {
                        fail("Could not determine the version from ${packageVersion}")
                    }
                    echo matcher.toString()


                    def major = Integer.parseInt(matcher[0][1])
                    def minor = Integer.parseInt(matcher[0][2])
                    def revision = Integer.parseInt(matcher[0][3])

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

