/**
 * Progress Tracker for Learn AI
 * Tracks lesson completion using localStorage
 */

class ProgressTracker {
  constructor() {
    this.storageKey = 'learn-ai-progress';
    this.progress = this.loadProgress();
    this.totalLessons = 66; // 22 weeks × 3 lessons
    this.init();
  }

  /**
   * Load progress from localStorage
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading progress:', error);
      return {};
    }
  }

  /**
   * Save progress to localStorage
   */
  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    } catch (error) {
      console.error('Error saving progress:', error);
      this.showToast('Failed to save progress', 'error');
    }
  }

  /**
   * Initialize the progress tracker
   */
  init() {
    this.createCheckboxes();
    this.updateUI();
    this.attachEventListeners();
  }

  /**
   * Create checkboxes for all lessons
   */
  createCheckboxes() {
    const lessonCards = document.querySelectorAll('.lesson-card');

    lessonCards.forEach((card, index) => {
      // Find the week this lesson belongs to
      const weekCard = card.closest('.week-card');
      const weekIndex = Array.from(document.querySelectorAll('.week-card')).indexOf(weekCard);
      const lessonIndex = Array.from(weekCard.querySelectorAll('.lesson-card')).indexOf(card);

      // Create unique lesson ID
      const lessonId = `week-${weekIndex + 1}-lesson-${lessonIndex + 1}`;
      card.setAttribute('data-lesson-id', lessonId);

      // Create checkbox
      const checkbox = document.createElement('div');
      checkbox.className = 'lesson-checkbox';
      checkbox.setAttribute('role', 'checkbox');
      checkbox.setAttribute('aria-checked', this.progress[lessonId] ? 'true' : 'false');
      checkbox.setAttribute('tabindex', '0');

      if (this.progress[lessonId]) {
        checkbox.classList.add('checked');
      }

      // Insert checkbox at the beginning of the card
      card.insertBefore(checkbox, card.firstChild);

      // Add click handler
      checkbox.addEventListener('click', () => this.toggleLesson(lessonId, checkbox));

      // Add keyboard support
      checkbox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleLesson(lessonId, checkbox);
        }
      });
    });
  }

  /**
   * Toggle lesson completion status
   */
  toggleLesson(lessonId, checkbox) {
    this.progress[lessonId] = !this.progress[lessonId];

    // Update checkbox UI
    if (this.progress[lessonId]) {
      checkbox.classList.add('checked');
      checkbox.setAttribute('aria-checked', 'true');
    } else {
      checkbox.classList.remove('checked');
      checkbox.setAttribute('aria-checked', 'false');
    }

    this.saveProgress();
    this.updateUI();
    this.animateProgress();

    // Show toast notification
    const message = this.progress[lessonId]
      ? '✓ Lesson completed!'
      : 'Lesson unmarked';
    this.showToast(message, this.progress[lessonId] ? 'success' : 'info');
  }

  /**
   * Get completion count
   */
  getCompletionCount() {
    return Object.values(this.progress).filter(Boolean).length;
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage() {
    const completed = this.getCompletionCount();
    return Math.round((completed / this.totalLessons) * 100);
  }

  /**
   * Update UI with current progress
   */
  updateUI() {
    const completed = this.getCompletionCount();
    const percentage = this.getCompletionPercentage();

    // Update progress card if it exists
    const progressCard = document.querySelector('.progress-card');
    if (!progressCard) return;

    // Update stats
    const completedCount = progressCard.querySelector('.completed-count');
    const totalCount = progressCard.querySelector('.total-count');
    const percentageText = progressCard.querySelector('.percentage-text');
    const progressBar = progressCard.querySelector('.progress-bar');
    const progressText = progressCard.querySelector('.progress-text');

    if (completedCount) completedCount.textContent = completed;
    if (totalCount) totalCount.textContent = this.totalLessons;
    if (percentageText) percentageText.textContent = `${percentage}%`;

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      progressBar.textContent = `${percentage}%`;
    }

    if (progressText) {
      progressText.textContent = `${completed} of ${this.totalLessons} lessons completed`;
    }

    // Update week-by-week progress if section exists
    this.updateWeekProgress();
  }

  /**
   * Update week-by-week progress breakdown
   */
  updateWeekProgress() {
    const weekProgressContainer = document.querySelector('.week-progress');
    if (!weekProgressContainer) return;

    // Clear existing content
    const existingItems = weekProgressContainer.querySelectorAll('.week-progress-item');
    existingItems.forEach(item => item.remove());

    // Calculate progress for each week
    const weekCards = document.querySelectorAll('.week-card');
    weekCards.forEach((weekCard, weekIndex) => {
      const weekLessons = weekCard.querySelectorAll('.lesson-card');
      const completedInWeek = Array.from(weekLessons).filter(lesson => {
        const lessonId = lesson.getAttribute('data-lesson-id');
        return this.progress[lessonId];
      }).length;

      const weekName = weekCard.querySelector('.week-header h3')?.textContent || `Week ${weekIndex + 1}`;

      // Create progress item
      const item = document.createElement('div');
      item.className = 'week-progress-item';
      item.innerHTML = `
        <span class="week-name">${weekName}</span>
        <span class="week-count">${completedInWeek}/${weekLessons.length}</span>
      `;

      weekProgressContainer.appendChild(item);
    });
  }

  /**
   * Animate progress bar
   */
  animateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    // Add a pulse animation
    progressBar.style.transition = 'none';
    progressBar.style.transform = 'scaleY(1.1)';

    setTimeout(() => {
      progressBar.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      progressBar.style.transform = 'scaleY(1)';
    }, 100);
  }

  /**
   * Attach event listeners to buttons
   */
  attachEventListeners() {
    // Reset progress button
    const resetBtn = document.getElementById('reset-progress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetProgress());
    }

    // Export progress button
    const exportBtn = document.getElementById('export-progress');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportProgress());
    }
  }

  /**
   * Reset all progress
   */
  resetProgress() {
    if (!confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      return;
    }

    this.progress = {};
    this.saveProgress();

    // Update all checkboxes
    document.querySelectorAll('.lesson-checkbox').forEach(checkbox => {
      checkbox.classList.remove('checked');
      checkbox.setAttribute('aria-checked', 'false');
    });

    this.updateUI();
    this.showToast('Progress reset successfully', 'info');
  }

  /**
   * Export progress as JSON
   */
  exportProgress() {
    const data = {
      totalLessons: this.totalLessons,
      completed: this.getCompletionCount(),
      percentage: this.getCompletionPercentage(),
      progress: this.progress,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learn-ai-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Progress exported successfully', 'success');
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ProgressTracker();
  });
} else {
  new ProgressTracker();
}
