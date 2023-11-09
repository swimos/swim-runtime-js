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

    stages {
        stage('configure-npm') {
            steps {
                container('node') {
                    script {
                        def npmrc = """
progress=false
color=never
"""
                        writeFile file: '.npmrc', text: npmrc
                    }
                }
            }
        }
        stage('read-version') {
            steps {
                script {
                    def packageContents = readJSON file: 'package.json'
                    def packageVersion = packageContents['version']

                    def matcher = (packageVersion =~ /^(\d+)\.(\d+)\.(\d+)/)

                    if (!matcher) {
                        fail("Could not determine the version from ${packageVersion}")
                    }

                    //def means local variable. Removing means global.
                    version_major = Integer.parseInt(matcher[0][1])
                    version_minor = Integer.parseInt(matcher[0][2])
                    version_revision = Integer.parseInt(matcher[0][3])

                    echo "${version_major}.${version_minor}.${version_revision}"
                }
            }
        }

        stage('generate-version-dev') {
            when {
                anyOf {
                    branch pattern: "^\\d+.\\d+.\\d+", comparator: "REGEXP";
                    branch pattern: "PR-\\d+", comparator: "REGEXP"
                }
            }
            steps {
                script {
                    def now = new Date()
                    def timestamp = now.format("yyMMddHHmmss", TimeZone.getTimeZone('UTC'))
                    version = "${version_major}.${version_minor}.${version_revision}-dev.${timestamp}"
                    echo "Setting version to '${version}'"
                }
            }
        }

        stage('generate-version-prod') {
            when {
                branch 'main';
            }
            steps {
                script {
                    version = ""
                }
            }
        }

        stage('modify-version') {
            when {
                anyOf {
                    branch 'main';
                    branch pattern: "^\\d+.\\d+.\\d+", comparator: "REGEXP";
                    branch pattern: "PR-\\d+", comparator: "REGEXP"
                }
            }
            steps {
                script {
                    def packageContents = readJSON file: 'package.json'
                    packageContents['version'] = version
                    echo version.getClass().toString()

                    writeJSON file: 'package.json', json: packageContents, pretty: 4
                    archiveArtifacts artifacts: 'package.json'
                }
            }
        }

        stage('build') {
            steps {
                container('node') {
                    sh 'npm install'
                    sh 'npm run bootstrap'
                    sh 'npx swim-build'
                }
            }
        }
    }
}

