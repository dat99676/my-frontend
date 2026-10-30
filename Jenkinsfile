
pipeline {
    agent any

    // Kiểm tra GitHub mỗi 2 phút xem có commit mới không
    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        IMAGE_NAME = 'shop-frontend'
        DOCKERHUB_USER = 'quydat14'
    }

    stages {
        // 1. Checkout source code
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // 2. Build Docker image
        stage('Docker Build') {
            steps {
                sh '''
                    docker build \
                        -t docker.io/${DOCKERHUB_USER}/${IMAGE_NAME}:latest \
                        -t docker.io/${DOCKERHUB_USER}/${IMAGE_NAME}:${BUILD_NUMBER} \
                        .
                '''
            }
        }

        // 3. Push image lên Docker Hub
        stage('Push Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin

                        docker push docker.io/${DOCKER_USER}/${IMAGE_NAME}:latest

                        docker push docker.io/${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER}
                    '''
                }
            }
        }

        // 4. Deploy Render
        stage('Deploy Render') {
            steps {
                catchError(
                    buildResult: 'SUCCESS',
                    stageResult: 'UNSTABLE'
                ) {
                    withCredentials([
                        string(
                            credentialsId: 'render-hook-url',
                            variable: 'RENDER_HOOK'
                        )
                    ]) {
                        sh '''
                            curl -fsS -X POST "$RENDER_HOOK"
                        '''
                    }
                }
            }
        }
    }

    // Luôn đăng xuất Docker sau khi pipeline kết thúc
    post {
        always {
            sh 'docker logout || true'
        }
    }
}
