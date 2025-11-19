/**
 * Learn AI - Progress Tracker
 * Saves lesson completion to localStorage
 */

class ProgressTracker {
  constructor() {
    this.storageKey = 'learn-ai-progress';
    this.progress = this.loadProgress();
    this.totalLessons = 66; // Total lessons across all weeks
    this.init();
  }

  // Load progress from localStorage
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading progress:', error);
      return {};
    }
  }

  // Save progress to localStorage
  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  // Check if lesson is completed
  isCompleted(lessonId) {
    return this.progress[lessonId] === true;
  }

  // Toggle lesson completion
  toggleLesson(lessonId) {
    this.progress[lessonId] = !this.progress[lessonId];
    this.saveProgress();
    this.updateUI();
    this.animateProgress();
  }

  // Get completion count
  getCompletionCount() {
    return Object.values(this.progress).filter(v => v === true).length;
  }

  // Get completion percentage
  getCompletionPercentage() {
    const completed = this.getCompletionCount();
    return Math.round((completed / this.totalLessons) * 100);
  }

  // Initialize UI
  init() {
    this.createCheckboxes();
    this.updateUI();
    this.addEventListeners();
  }

  // Create checkboxes for all lessons
  createCheckboxes() {
    const lessonCards = document.querySelectorAll('.lesson-card');

    lessonCards.forEach((card, index) => {
      // Create unique lesson ID
      const weekCard = card.closest('.week-card');
      const weekIndex = Array.from(document.querySelectorAll('.week-card')).indexOf(weekCard);
      const lessonIndex = Array.from(weekCard.querySelectorAll('.lesson-card')).indexOf(card);
      const lessonId = `week-${weekIndex + 1}-lesson-${lessonIndex + 1}`;

      card.setAttribute('data-lesson-id', lessonId);

      // Create checkbox element
      const checkbox = document.createElement('div');
      checkbox.className = 'lesson-checkbox';
      checkbox.setAttribute('role', 'checkbox');
      checkbox.setAttribute('aria-checked', this.isCompleted(lessonId));
      checkbox.setAttribute('tabindex', '0');

      if (this.isCompleted(lessonId)) {
        checkbox.classList.add('checked');
        card.classList.add('completed');
      }

      // Insert checkbox before lesson icon
      const lessonIcon = card.querySelector('.lesson-icon');
      if (lessonIcon) {
        card.insertBefore(checkbox, lessonIcon);
      } else {
        card.insertBefore(checkbox, card.firstChild);
      }
    });
  }

  // Add event listeners
  addEventListeners() {
    // Click event for checkboxes
    document.querySelectorAll('.lesson-checkbox').forEach(checkbox => {
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        const lessonCard = checkbox.closest('.lesson-card');
        const lessonId = lessonCard.getAttribute('data-lesson-id');
        this.toggleLesson(lessonId);

        // Update checkbox UI
        checkbox.classList.toggle('checked');
        checkbox.setAttribute('aria-checked', this.isCompleted(lessonId));
        lessonCard.classList.toggle('completed');

        // Animate checkbox
        checkbox.style.transform = 'scale(1.2)';
        setTimeout(() => {
          checkbox.style.transform = 'scale(1)';
        }, 200);
      });

      // Keyboard support
      checkbox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          checkbox.click();
        }
      });
    });

    // Reset progress button
    const resetBtn = document.getElementById('reset-progress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
          this.resetProgress();
        }
      });
    }

    // Export progress button
    const exportBtn = document.getElementById('export-progress');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportProgress();
      });
    }
  }

  // Update all UI elements
  updateUI() {
    const completed = this.getCompletionCount();
    const percentage = this.getCompletionPercentage();

    // Update main progress bar
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const completedCount = document.querySelector('.completed-count');
    const totalCount = document.querySelector('.total-count');
    const percentageText = document.querySelector('.percentage-text');

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    if (progressText) {
      progressText.textContent = `${completed} of ${this.totalLessons} lessons completed`;
    }

    if (completedCount) {
      completedCount.textContent = completed;
    }

    if (totalCount) {
      totalCount.textContent = this.totalLessons;
    }

    if (percentageText) {
      percentageText.textContent = `${percentage}%`;
    }

    // Update week progress bars
    this.updateWeekProgress();
  }

  // Update progress for each week
  updateWeekProgress() {
    const weekCards = document.querySelectorAll('.week-card');

    weekCards.forEach((weekCard, weekIndex) => {
      const lessonCards = weekCard.querySelectorAll('.lesson-card');
      const totalInWeek = lessonCards.length;
      let completedInWeek = 0;

      lessonCards.forEach((card, lessonIndex) => {
        const lessonId = `week-${weekIndex + 1}-lesson-${lessonIndex + 1}`;
        if (this.isCompleted(lessonId)) {
          completedInWeek++;
        }
      });

      const weekPercentage = totalInWeek > 0 ? Math.round((completedInWeek / totalInWeek) * 100) : 0;

      // Update week progress bar
      let weekProgressContainer = weekCard.querySelector('.week-progress');
      if (!weekProgressContainer && totalInWeek > 0) {
        // Create week progress bar if it doesn't exist
        weekProgressContainer = document.createElement('div');
        weekProgressContainer.className = 'week-progress';
        weekProgressContainer.innerHTML = `
          <div class="week-progress-bar">
            <div class="week-progress-fill" style="width: ${weekPercentage}%"></div>
          </div>
          <div class="week-progress-text">${weekPercentage}%</div>
        `;

        const weekDescription = weekCard.querySelector('.week-description');
        if (weekDescription) {
          weekDescription.after(weekProgressContainer);
        }
      } else if (weekProgressContainer) {
        const fill = weekProgressContainer.querySelector('.week-progress-fill');
        const text = weekProgressContainer.querySelector('.week-progress-text');
        if (fill) fill.style.width = `${weekPercentage}%`;
        if (text) text.textContent = `${weekPercentage}%`;
      }
    });
  }

  // Animate progress bar
  animateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.transform = 'scaleY(1.2)';
      setTimeout(() => {
        progressBar.style.transition = 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease';
        progressBar.style.transform = 'scaleY(1)';
      }, 100);
    }
  }

  // Reset all progress
  resetProgress() {
    this.progress = {};
    this.saveProgress();

    // Reset UI
    document.querySelectorAll('.lesson-checkbox').forEach(checkbox => {
      checkbox.classList.remove('checked');
      checkbox.setAttribute('aria-checked', 'false');
    });

    document.querySelectorAll('.lesson-card').forEach(card => {
      card.classList.remove('completed');
    });

    this.updateUI();

    // Show success message
    this.showToast('Progress reset successfully!');
  }

  // Export progress as JSON
  exportProgress() {
    const data = {
      progress: this.progress,
      completedCount: this.getCompletionCount(),
      totalLessons: this.totalLessons,
      percentage: this.getCompletionPercentage(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learn-ai-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('Progress exported successfully!');
  }

  // Show toast notification
  showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: hsl(var(--primary));
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .lesson-checkbox {
    transition: all 0.2s ease;
  }
`;
document.head.appendChild(style);

// Initialize progress tracker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.progressTracker = new ProgressTracker();
});
