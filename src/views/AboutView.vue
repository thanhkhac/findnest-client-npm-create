<template>
  <div class="about-container">
    <section class="hero-section text-center">
      <h1 class="title">Về FindNest</h1>
      <p class="subtitle">Hành trình tìm nơi ở hoàn hảo của bạn bắt đầu từ đây</p>
    </section>

    <section class="content-section container my-5">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h2 class="section-title">Chúng tôi là ai?</h2>
          <p>
            FindNest là nền tảng tìm kiếm phòng trọ nhanh chóng, tiện lợi và đáng tin cậy. Chúng tôi ra đời với sứ mệnh giúp bạn tìm được "tổ ấm" phù hợp nhất, từ những căn phòng nhỏ ấm cúng đến những căn hộ hiện đại, tất cả đều trong tầm tay bạn.
          </p>
          <p>
            Với giao diện thân thiện, thông tin minh bạch và sự kết nối trực tiếp giữa người thuê và chủ nhà, FindNest cam kết mang đến trải nghiệm tìm trọ dễ dàng hơn bao giờ hết.
          </p>
        </div>
        <div class="col-md-6">
          <img src="https://findnest.site/image/Login.jpg" alt="FindNest Team" class="img-fluid rounded shadow">
        </div>
      </div>
    </section>

    <section class="mission-section bg-light py-5">
      <div class="container">
        <h2 class="section-title text-center">Sứ mệnh của chúng tôi</h2>
        <div class="row text-center">
          <div class="col-md-4">
            <i class="fas fa-home fa-3x mb-3 text-danger"></i>
            <h3>Tìm trọ dễ dàng</h3>
            <p>Cung cấp công cụ tìm kiếm thông minh, giúp bạn nhanh chóng lọc ra nơi ở lý tưởng.</p>
          </div>
          <div class="col-md-4">
            <i class="fas fa-handshake fa-3x mb-3 text-danger"></i>
            <h3>Kết nối đáng tin cậy</h3>
            <p>Xây dựng cầu nối giữa người thuê và chủ nhà, đảm bảo thông tin chính xác và minh bạch.</p>
          </div>
          <div class="col-md-4">
            <i class="fas fa-heart fa-3x mb-3 text-danger"></i>
            <h3>Trải nghiệm tuyệt vời</h3>
            <p>Mang đến sự hài lòng tối đa với dịch vụ hỗ trợ tận tâm và thân thiện.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-section container my-5 text-center">
      <h2 class="section-title">Liên hệ với chúng tôi</h2>
      <p>
        Bạn có câu hỏi hay cần hỗ trợ? Hãy gửi email cho chúng tôi tại
        <a href="mailto:support@findnest.site" class="text-danger">support@findnest.site</a>
        hoặc theo dõi chúng tôi trên mạng xã hội!
      </p>
      <div class="social-icons mt-3">
        <a href="#" class="mx-2"><i class="fab fa-facebook fa-2x text-danger"></i></a>
        <a href="#" class="mx-2"><i class="fab fa-instagram fa-2x text-danger"></i></a>
        <a href="#" class="mx-2"><i class="fab fa-twitter fa-2x text-danger"></i></a>
      </div>
    </section>
  </div>
</template>

<script setup>
  // Không cần logic đặc biệt trong trang này, để trống
</script>

<style scoped>
  .about-container {
    font-family: 'Arial', sans-serif;
  }

  .hero-section {
    background-color: #f8f9fa;
    padding: 60px 20px;
  }

  .title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #dc3545; /* Màu đỏ của FindNest */
  }

  .subtitle {
    font-size: 1.25rem;
    color: #6c757d;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }

  .content-section p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
  }

  .mission-section {
    background-color: #f1f1f1;
  }

  .mission-section h3 {
    font-size: 1.5rem;
    color: #333;
  }

  .mission-section p {
    font-size: 1rem;
    color: #666;
  }

  .contact-section a {
    text-decoration: none;
    font-weight: bold;
  }

  .contact-section a:hover {
    text-decoration: underline;
  }

  .social-icons a {
    transition: transform 0.3s ease;
  }

  .social-icons a:hover {
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    .hero-section {
      padding: 40px 15px;
    }

    .title {
      font-size: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
    }
  }
</style>