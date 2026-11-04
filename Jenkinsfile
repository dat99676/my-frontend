pipeline {
    agent any

    // Hỏi GitHub khoảng 2 phút một lần xem có commit mới không.
    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        IMAGE_NAME = 'shop-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'docker build -t docker.io/$DOCKER_USER/$IMAGE_NAME:latest -t docker.io/$DOCKER_USER/$IMAGE_NAME:$BUILD_NUMBER ./backend'
                }
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh 'docker push docker.io/$DOCKER_USER/$IMAGE_NAME:latest'
                    sh 'docker push docker.io/$DOCKER_USER/$IMAGE_NAME:$BUILD_NUMBER'
                }
            }
        }

        // Báo Render kéo image mới về (thay cho bước SSH vào máy chủ trong tài liệu)
        stage('Deploy Render') {
            steps {
                withCredentials([string(credentialsId: 'render-hook-url', variable: 'RENDER_HOOK')]) {
                    sh 'curl -fsS -X POST "$RENDER_HOOK"'
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}