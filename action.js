let highestZ = 1;
class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // ====== DI CHUYỂN CHUỘT + CẢM ỨNG ======
    const handleMove = (clientX, clientY) => {
      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // PC: chuột di chuyển
    document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    // Mobile: cảm ứng di chuyển
    document.addEventListener('touchmove', (e) => {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    // ====== BẮT ĐẦU CHUỘT ======
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      if (e.button === 0) {
        this.mouseTouchX = e.clientX;
        this.mouseTouchY = e.clientY;
        this.prevMouseX = this.mouseX = e.clientX;
        this.prevMouseY = this.mouseY = e.clientY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    // ====== BẮT ĐẦU CẢM ỨNG ======
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      const touch = e.touches[0];
      this.mouseTouchX = touch.clientX;
      this.mouseTouchY = touch.clientY;
      this.prevMouseX = this.mouseX = touch.clientX;
      this.prevMouseY = this.mouseY = touch.clientY;
    }, { passive: false });

    // ====== KẾT THÚC (CHUỘT + CẢM ỨNG) ======
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

// Áp dụng cho tất cả .paper
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
