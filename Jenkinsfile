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
                    originalVersion = packageContents['version']

                    def matcher = (originalVersion =~ /^(\d+)\.(\d+)\.(\d+)/)

                    if (!matcher) {
                        fail("Could not determine the version from ${originalVersion}")
                    }

                    //def means local variable. Removing means global.
                    version_major = Integer.parseInt(matcher[0][1])
                    version_minor = Integer.parseInt(matcher[0][2])
                    version_revision = Integer.parseInt(matcher[0][3])

                    echo "Version read ${version_major}.${version_minor}.${version_revision}"
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
                    version = "${version_major}.${version_minor}.${version_revision}-dev.${timestamp}" as String // Whoever came up with Groovy strings is an ass.
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
                    packageContents.version = version as String
                    echo version.getClass().toString()

                    def dependencies = packageContents['dependencies']
                    def dependencyUpdates = [:]

                    dependencies.each { entry ->
                        if (entry.value == originalVersion) {
                            dependencyUpdates.put(entry.key, version)
                        }
                    }

                    if (dependencyUpdates) {
                        dependencies.putAll(dependencyUpdates)
                    }

                    writeJSON file: 'package.json', json: packageContents, pretty: 4
                    archiveArtifacts artifacts: 'package.json'
                    writeFile file: 'version.txt', text: version
                    archiveArtifacts artifacts: 'version.json'
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

