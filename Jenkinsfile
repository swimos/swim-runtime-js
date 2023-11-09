pipeline {
    options {
        timeout(time: 1, unit: 'HOURS')
        ansiColor('xterm')
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
                    def packageFiles = findFiles glob: '**/package.json'
                    packageFiles.each { packageFile ->
                        def packageContents = readJSON file: "${packageFile}"
                        packageContents.version = version as String

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

                        def devDependencies = packageContents['devDependencies']
                        def devDependencyUpdates = [:]

                        devDependencies.each { entry ->
                            if (entry.value == originalVersion) {
                                devDependencyUpdates.put(entry.key, version)
                            }
                        }

                        if (devDependencyUpdates) {
                            devDependencies.putAll(devDependencyUpdates)
                        }
                        

                        writeJSON file: "${packageFile}", json: packageContents, pretty: 4
                        archiveArtifacts artifacts: "${packageFile}"
                    }

                    writeFile file: 'version.txt', text: version
                    archiveArtifacts artifacts: 'version.txt'
                }
            }
        }

        stage('build') {
            steps {
                container('node') {
                    sh 'npm install'
                    sh 'npm run bootstrap'
                    sh 'npx swim-build'
                    archiveArtifacts artifacts: "swim-core/**/dist/**/*.*"
                    archiveArtifacts artifacts: "swim-host/**/dist/**/*.*"
                    archiveArtifacts artifacts: "dist/**/*.*"
                }
            }
        }

        stage('test') {
            steps {
                container('node') {
                    sh 'npx swim-build test'
                }
            }
        }

        stage('publish') {
            steps {
                container('node') {
                    sh 'npx swim-build publish'
                }
            }
        }
    }
}

