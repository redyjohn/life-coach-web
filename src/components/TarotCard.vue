<template>
  <div 
    class="tarot-card" 
    :class="{ 
      'reversed': card.reversed, 
      'flipped': isFlipped,
      'drawing': isDrawing
    }"
    @click="flipCard"
  >
    <!-- 卡牌背面 -->
    <div class="card-back">
      <div class="card-back-design">
        <div class="mystical-symbol">🔮</div>
        <div class="card-back-text">TAROT</div>
      </div>
    </div>
    
    <!-- 卡牌正面 -->
    <div class="card-front">
      <div class="card-header">
        <div class="card-name">{{ card.name }}</div>
        <div class="card-name-en">{{ card.nameEn }}</div>
      </div>
      
      <div class="card-symbol">
        <div v-if="card.suit === 'major'" class="major-symbol">
          {{ getMajorSymbol(card.id) }}
        </div>
        <div v-else class="suit-symbol">
          {{ getSuitSymbol(card.suit) }}
        </div>
      </div>
      
      <div class="card-meaning">
        <div class="meaning-text">{{ card.meaning }}</div>
        <div v-if="card.reversed" class="reversed-indicator">逆位</div>
      </div>
      
      <div class="card-keywords">
        <span 
          v-for="keyword in card.keywords.slice(0, 3)" 
          :key="keyword"
          class="keyword-tag"
        >
          {{ keyword }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TarotCard } from '@/utils/tarotCards'

interface Props {
  card: TarotCard
  isDrawing?: boolean
}

const props = defineProps<Props>()
const isFlipped = ref(false)

// 翻牌動畫
function flipCard() {
  if (!isFlipped.value) {
    isFlipped.value = true
  }
}

// 大阿爾卡納符號
function getMajorSymbol(id: number): string {
  const symbols = [
    '🃏', '🪄', '🌙', '👑', '🏛️', '⛪', '💕', '🏺', '💪', '🔍',
    '🎡', '⚖️', '🔄', '💀', '🍷', '😈', '🗼', '⭐', '🌕', '☀️',
    '📯', '🌍'
  ]
  return symbols[id] || '🔮'
}

// 花色符號
function getSuitSymbol(suit: string): string {
  const symbols = {
    'cups': '🏺',
    'wands': '🪄',
    'swords': '⚔️',
    'pentacles': '🪙'
  }
  return symbols[suit as keyof typeof symbols] || '🔮'
}
</script>

<style scoped>
.tarot-card {
  width: 200px;
  height: 320px;
  position: relative;
  perspective: 1000px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tarot-card:hover {
  transform: translateY(-10px);
}

.tarot-card.drawing {
  animation: drawCard 1.5s ease-out forwards;
}

.tarot-card.flipped .card-back {
  transform: rotateY(180deg);
}

.tarot-card.flipped .card-front {
  transform: rotateY(0deg);
}

.tarot-card.reversed.flipped .card-front {
  transform: rotateY(0deg) rotate(180deg);
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.8s ease;
}

.card-back {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotateY(0deg);
}

.card-back-design {
  text-align: center;
  color: #8B5CF6;
}

.mystical-symbol {
  font-size: 3rem;
  margin-bottom: 10px;
  animation: pulse 2s infinite;
}

.card-back-text {
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

.card-front {
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  padding: 16px;
  display: flex;
  flex-direction: column;
  transform: rotateY(180deg);
  border: 2px solid #8B5CF6;
}

.card-header {
  text-align: center;
  margin-bottom: 12px;
}

.card-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 4px;
}

.card-name-en {
  font-size: 0.8rem;
  color: #8B5CF6;
  font-style: italic;
}

.card-symbol {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 12px 0;
}

.major-symbol,
.suit-symbol {
  animation: float 3s ease-in-out infinite;
}

.card-meaning {
  text-align: center;
  margin-bottom: 12px;
}

.meaning-text {
  font-size: 0.9rem;
  color: #2c3e50;
  line-height: 1.4;
  margin-bottom: 4px;
}

.reversed-indicator {
  font-size: 0.7rem;
  color: #e74c3c;
  font-weight: bold;
  background: rgba(231, 76, 60, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
}

.card-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.keyword-tag {
  font-size: 0.7rem;
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 500;
}

/* 動畫效果 */
@keyframes drawCard {
  0% {
    transform: translateY(100px) rotateY(0deg);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px) rotateY(180deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0) rotateY(0deg);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .tarot-card {
    width: 150px;
    height: 240px;
  }
  
  .card-front {
    padding: 12px;
  }
  
  .card-name {
    font-size: 1rem;
  }
  
  .card-name-en {
    font-size: 0.7rem;
  }
  
  .card-symbol {
    font-size: 2rem;
  }
  
  .meaning-text {
    font-size: 0.8rem;
  }
  
  .mystical-symbol {
    font-size: 2rem;
  }
  
  .card-back-text {
    font-size: 1rem;
  }
}
</style>

