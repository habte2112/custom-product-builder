// ════════════════════════════════════════
// REVIEWS MODULE
// Import this in catalog.html and index.html
// ════════════════════════════════════════

const API = 'https://custom-product-backend-production.up.railway.app/api';

// ── Render star rating HTML ──
export function renderStars(rating, interactive = false, size = '20px') {
  if (interactive) {
    return [1,2,3,4,5].map(i => `
      <span class="star-btn" data-value="${i}"
        style="font-size:${size};cursor:pointer;color:#ccc;transition:color 0.15s;">
        ★
      </span>`).join('');
  }
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return `
    ${'<span style="color:#ff9900;">★</span>'.repeat(full)}
    ${half ? '<span style="color:#ff9900;">½</span>' : ''}
    ${'<span style="color:#333;">★</span>'.repeat(empty)}`;
}

// ── Fetch and render reviews section ──
export async function loadReviews(productId, productKey, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div style="color:#555;text-align:center;padding:20px;">Loading reviews...</div>`;

  try {
    const res  = await fetch(`${API}/reviews/${productId}`);
    const data = await res.json();

    const { reviews, totalReviews, avgRating, breakdown } = data;

    const token   = localStorage.getItem('token');
    const isLoggedIn = !!token;

    container.innerHTML = `
      <div class="reviews-section">

        <!-- ── Summary ── -->
        <div class="reviews-summary">
          <div class="avg-rating-block">
            <div class="avg-number">${avgRating || '—'}</div>
            <div class="avg-stars">${renderStars(avgRating)}</div>
            <div class="avg-count">${totalReviews} review${totalReviews !== 1 ? 's' : ''}</div>
          </div>

          <div class="rating-breakdown">
            ${[5,4,3,2,1].map(star => {
              const count = breakdown[star] || 0;
              const pct   = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return `
                <div class="breakdown-row">
                  <span class="breakdown-label">${star} ★</span>
                  <div class="breakdown-bar">
                    <div class="breakdown-fill" style="width:${pct}%"></div>
                  </div>
                  <span class="breakdown-count">${count}</span>
                </div>`;
            }).join('')}
          </div>
        </div>

        <!-- ── Write Review Button ── -->
        ${isLoggedIn ? `
          <button class="btn-write-review" id="btn-write-review-${productId}">
            ✏️ Write a Review
          </button>
        ` : `
          <p style="color:#555;font-size:14px;margin-bottom:20px;">
            <a href="login.html" style="color:#ff9900;">Login</a> to write a review
          </p>
        `}

        <!-- ── Review Form (hidden by default) ── -->
        <div class="review-form" id="review-form-${productId}" style="display:none;">
          <h4 style="font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1px;color:#f0f0f0;margin-bottom:16px;">
            Write Your Review
          </h4>

          <!-- Star selector -->
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#555;margin-bottom:8px;">
              Rating
            </label>
            <div class="star-selector" id="star-selector-${productId}">
              ${renderStars(0, true, '28px')}
            </div>
            <input type="hidden" id="rating-value-${productId}" value="0">
          </div>

          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#555;margin-bottom:8px;">
              Title
            </label>
            <input type="text"
              id="review-title-${productId}"
              placeholder="Sum up your experience"
              style="width:100%;background:#0f0f0f;border:1px solid #333;border-radius:8px;padding:10px 13px;color:#f0f0f0;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;">
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#555;margin-bottom:8px;">
              Review
            </label>
            <textarea
              id="review-body-${productId}"
              placeholder="Tell others about your experience..."
              rows="4"
              style="width:100%;background:#0f0f0f;border:1px solid #333;border-radius:8px;padding:10px 13px;color:#f0f0f0;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;resize:vertical;"></textarea>
          </div>

          <div id="review-msg-${productId}" style="font-size:13px;margin-bottom:12px;min-height:18px;"></div>

          <div style="display:flex;gap:10px;">
            <button class="btn-submit-review" id="btn-submit-review-${productId}" data-pid="${productId}" data-pkey="${productKey}">
              Submit Review
            </button>
            <button class="btn-cancel-review" id="btn-cancel-review-${productId}">
              Cancel
            </button>
          </div>
        </div>

        <!-- ── Reviews List ── -->
        <div class="reviews-list" id="reviews-list-${productId}">
          ${reviews.length === 0
            ? `<div style="color:#444;text-align:center;padding:40px;">
                No reviews yet. Be the first to review this product!
               </div>`
            : reviews.map(r => `
                <div class="review-card">
                  <div class="review-header">
                    <div>
                      <div class="review-stars">${renderStars(r.rating)}</div>
                      <div class="review-title">${r.title}</div>
                    </div>
                    <div class="review-meta">
                      ${r.verified ? '<span class="verified-badge">✅ Verified Purchase</span>' : ''}
                      <span class="review-date">${new Date(r.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                    </div>
                  </div>
                  <div class="review-author">by ${r.userName}</div>
                  <div class="review-body">${r.body}</div>
                  <button class="btn-helpful" data-id="${r._id}">
                    👍 Helpful (${r.helpful})
                  </button>
                </div>`).join('')}
        </div>

      </div>`;

    // ── Star selector interaction ──
    if (isLoggedIn) {
      const starSelector = document.getElementById(`star-selector-${productId}`);
      const ratingInput  = document.getElementById(`rating-value-${productId}`);

      if (starSelector) {
        const stars = starSelector.querySelectorAll('.star-btn');

        stars.forEach(star => {
          star.addEventListener('mouseover', () => {
            const val = Number(star.dataset.value);
            stars.forEach(s => {
              s.style.color = Number(s.dataset.value) <= val ? '#ff9900' : '#333';
            });
          });

          star.addEventListener('mouseout', () => {
            const selected = Number(ratingInput.value);
            stars.forEach(s => {
              s.style.color = Number(s.dataset.value) <= selected ? '#ff9900' : '#333';
            });
          });

          star.addEventListener('click', () => {
            ratingInput.value = star.dataset.value;
            stars.forEach(s => {
              s.style.color = Number(s.dataset.value) <= Number(star.dataset.value) ? '#ff9900' : '#333';
            });
          });
        });
      }

      // ── Toggle review form ──
      const btnWrite = document.getElementById(`btn-write-review-${productId}`);
      const form     = document.getElementById(`review-form-${productId}`);

      if (btnWrite) {
        btnWrite.addEventListener('click', () => {
          form.style.display = form.style.display === 'none' ? 'block' : 'none';
        });
      }

      // ── Cancel ──
      const btnCancel = document.getElementById(`btn-cancel-review-${productId}`);
      if (btnCancel) {
        btnCancel.addEventListener('click', () => {
          form.style.display = 'none';
        });
      }

      // ── Submit review ──
      const btnSubmit = document.getElementById(`btn-submit-review-${productId}`);
      if (btnSubmit) {
        btnSubmit.addEventListener('click', async () => {
          const rating = Number(document.getElementById(`rating-value-${productId}`).value);
          const title  = document.getElementById(`review-title-${productId}`).value.trim();
          const body   = document.getElementById(`review-body-${productId}`).value.trim();
          const msgEl  = document.getElementById(`review-msg-${productId}`);

          if (!rating) return showMsg(msgEl, '⚠️ Please select a star rating.', 'error');
          if (!title)  return showMsg(msgEl, '⚠️ Please add a title.', 'error');
          if (!body)   return showMsg(msgEl, '⚠️ Please write your review.', 'error');

          btnSubmit.disabled    = true;
          btnSubmit.textContent = 'Submitting...';

          try {
            const res = await fetch(`${API}/reviews`, {
              method:  'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${token}`
              },
              body: JSON.stringify({ productId, productKey, rating, title, body })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            showMsg(msgEl, '✅ Review submitted! Thank you!', 'success');
            setTimeout(() => loadReviews(productId, productKey, containerId), 1500);

          } catch (err) {
            showMsg(msgEl, `❌ ${err.message}`, 'error');
            btnSubmit.disabled    = false;
            btnSubmit.textContent = 'Submit Review';
          }
        });
      }
    }

    // ── Helpful buttons ──
    container.querySelectorAll('.btn-helpful').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          const res  = await fetch(`${API}/reviews/${btn.dataset.id}/helpful`, { method: 'POST' });
          const data = await res.json();
          btn.textContent = `👍 Helpful (${data.helpful})`;
          btn.disabled    = true;
        } catch {}
      });
    });

  } catch (err) {
    container.innerHTML = `<div style="color:#fc8181;text-align:center;padding:20px;">Failed to load reviews.</div>`;
  }
}

function showMsg(el, msg, type) {
  el.textContent = msg;
  el.style.color = type === 'success' ? '#68d391' : '#fc8181';
}

// ── Reviews CSS — inject once ──
if (!document.getElementById('reviews-css')) {
  const style = document.createElement('style');
  style.id = 'reviews-css';
  style.textContent = `
    .reviews-section { margin-top: 32px; }

    .reviews-summary {
      display: flex;
      gap: 32px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .avg-rating-block { text-align: center; min-width: 100px; }
    .avg-number { font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: #ff9900; line-height: 1; }
    .avg-stars  { font-size: 20px; margin: 6px 0; }
    .avg-count  { font-size: 13px; color: #555; }

    .rating-breakdown { flex: 1; min-width: 200px; }
    .breakdown-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    .breakdown-label { font-size: 13px; color: #ff9900; width: 32px; flex-shrink: 0; }
    .breakdown-bar { flex: 1; height: 8px; background: #2a2a2a; border-radius: 4px; overflow: hidden; }
    .breakdown-fill { height: 100%; background: #ff9900; border-radius: 4px; transition: width 0.4s ease; }
    .breakdown-count { font-size: 13px; color: #555; width: 24px; text-align: right; }

    .btn-write-review {
      background: #ff9900; color: #000; border: none;
      padding: 10px 20px; border-radius: 8px;
      font-size: 14px; font-weight: 700; cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      margin-bottom: 20px; transition: background 0.2s;
    }
    .btn-write-review:hover { background: #ffb84d; }

    .review-form {
      background: #1a1a1a; border: 1px solid #2a2a2a;
      border-radius: 14px; padding: 24px; margin-bottom: 24px;
      animation: fadeIn 0.2s ease;
    }

    .star-selector { display: flex; gap: 4px; margin-bottom: 4px; }

    .btn-submit-review {
      background: #ff9900; color: #000; border: none;
      padding: 10px 20px; border-radius: 8px;
      font-size: 14px; font-weight: 700; cursor: pointer;
      font-family: 'DM Sans', sans-serif; transition: background 0.2s;
    }
    .btn-submit-review:hover { background: #ffb84d; }
    .btn-submit-review:disabled { background: #555; color: #888; cursor: not-allowed; }

    .btn-cancel-review {
      background: none; border: 1px solid #333; color: #666;
      padding: 10px 20px; border-radius: 8px;
      font-size: 14px; cursor: pointer;
      font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    }
    .btn-cancel-review:hover { color: #ccc; border-color: #555; }

    .reviews-list { margin-top: 8px; }

    .review-card {
      background: #1a1a1a; border: 1px solid #2a2a2a;
      border-radius: 12px; padding: 20px;
      margin-bottom: 14px; transition: border-color 0.2s;
    }
    .review-card:hover { border-color: #333; }

    .review-header {
      display: flex; justify-content: space-between;
      align-items: flex-start; margin-bottom: 6px; flex-wrap: wrap; gap: 8px;
    }

    .review-stars { font-size: 16px; color: #ff9900; margin-bottom: 4px; }
    .review-title { font-weight: 700; font-size: 15px; color: #f0f0f0; }
    .review-meta  { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }

    .verified-badge {
      font-size: 11px; color: #68d391;
      background: rgba(72,187,120,0.1);
      padding: 2px 8px; border-radius: 10px;
    }

    .review-date   { font-size: 12px; color: #555; }
    .review-author { font-size: 13px; color: #666; margin-bottom: 10px; }
    .review-body   { font-size: 14px; color: #aaa; line-height: 1.6; margin-bottom: 12px; }

    .btn-helpful {
      background: none; border: 1px solid #2a2a2a; color: #555;
      padding: 5px 12px; border-radius: 6px;
      font-size: 12px; cursor: pointer;
      font-family: 'DM Sans', sans-serif; transition: all 0.15s;
    }
    .btn-helpful:hover   { border-color: #ff9900; color: #ff9900; }
    .btn-helpful:disabled{ opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);
}