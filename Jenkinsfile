pipeline {
    agent any

    // Hỏi GitHub khoảng 2 phút một lần xem có commit mới không.
    // (Tài liệu của thầy dùng webhook, nhưng GitHub không gọi được vào laptop của bạn.)
    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        IMAGE_NAME = 'shop-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                // Lấy đúng repo và nhánh đã khai báo trong Pipeline Job
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    // Dấu nháy đơn: để shell đọc biến, mật khẩu không bị ghép vào chuỗi lệnh
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

        // Thay cho bước SSH vào máy chủ trong tài liệu: báo Render kéo image mới về.
        // Chưa tạo credential render-hook-url thì bước này báo vàng (UNSTABLE), pipeline vẫn tính là thành công.
        stage('Deploy Render') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    withCredentials([string(credentialsId: 'render-hook-url', variable: 'RENDER_HOOK')]) {
                        sh 'curl -fsS -X POST "$RENDER_HOOK"'
                    }
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
