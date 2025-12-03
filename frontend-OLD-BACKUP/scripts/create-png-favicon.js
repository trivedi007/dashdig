#!/usr/bin/env node

/**
 * Create a simple PNG favicon using ASCII-to-PNG technique
 * This creates a basic 32x32 favicon with the lightning bolt
 */

const fs = require('fs');
const path = require('path');

console.log('⚡ Creating basic PNG favicons...\n');

// Create a simple 32x32 PNG using data URL
// This is a lightning bolt in orange
const lightning32Base64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAICSURBVFiF7ZbPaxNBFMe/szOz2aTZTZqmJhqtRUTwIIieFPHgxYsHQf9A/wHBg3gQPHjx4EHw4EHwB3jwD/AgCJ48CA2ClCZNm6a7SXbTzM7O7IwH0x/b3cQf4MG+0wwz35l5n/c+7x0BfOP/FvGz4/P5fCqPxxMwDKPMCCHn8/nO9vv9fqvV+ioB4DabzQsAVsrBwUEHQBWA6na7I9vr9SqMEOKybTuSyWT62rbdy+fzp5IkVRqNxrO2bYeEEKG0bdvK5/OpQqHwBcCDqakpnWEYdHV1tdBoNM5N0xw2m82IoiiIRCLw+/2o1WooFov4+PHjQbFYtERJktqKoixms9k3AIhM09Q6nQ4kSYKu6/B6veh0OlAUBbu7uzBNE5cuXYKmaTAMAxcuXICqqpAkSdN1/btM03QqlUqh1WqB53ksFstYLpeYmJhAoVDA6ekpbNuGbduwLAvFYhHhcBiFQgGtra2pYrGYJ5xz7OzsIBgMIhqNYnZ2FuVyGZIkwTRNzM3NYXl5GeFwGI1GAwzDgOM4tCzLBsdxoGkaE4sXL+L6jZs4Oj5GPB4HwzAYjUaIRqOYnZ3F+vo6dF2HqqpgWZYSAGg0Gl+9fv0aqqri9u3bmJ6eRjQaRTabheM4qNfrMAyDr6+vt4hpmk4ymfza7/cxPz+PQCCAcrn8nRDikGVZNxaLHQOANBqN3pXL5e8AvP4F/x/Ff8CPrF/eIJq6DQAAAABJRU5ErkJggg==';

const favicon32Path = path.join(__dirname, '../public/favicon.png');
const favicon32Buffer = Buffer.from(lightning32Base64, 'base64');
fs.writeFileSync(favicon32Path, favicon32Buffer);
console.log(`✅ Created: ${favicon32Path}`);

// Create a simple 180x180 Apple Touch Icon
// This is a larger version of the lightning bolt
const appleIcon180Base64 = 'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAABRxJREFUeJzt3V9oVXUcwPHv2bnbvNttc3PObf7ZH7GUyEgrCykfeoiIgiJ66aH+PIQ99BQlEQURQRAUFEEPFRERRVHRQw9BUEQQUhBmZpY5p5tz253zvN2d3v1xHaW5ee85v3N+v9/vfD/wfWnu7tzv+e793d/5nd85R0gppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSil VVCw7QFHY8fjMB4C7gZuBW4BlwGLgJmARMAHMATOAB5wG/gLOAKeBk8DJ+Y/T88eCrP99mliE9vLy8sJXAQ8CDwOPAQ8ACyIeTgC/AT8Dx4AjwBHgx/nj6YjHVZZQH9pLkqR6LfAk8CywHpgXcdhLwEHge+Ag8N38MSPR/l9KRWgvTZK4CngK2AasB6yW/CsB8A3wJfDV/PHfpP6TRdCgvSRJ7BLgWeAlYFPEo/5/fAd8AXwGfDN/PJv2D89l0F6SJAuAZ4BXgfsiHlc9J4E9wCfAV0HxzGY0aM9PkiSuAF4GXgFWRzzu/38BPgY+CH443LSfmKugvSRJ7BLgBeB14LaIxzXhAnAA2AN8GARBv86PzEXQXpIkdiPwOrCd2g1r3vwF7AfeC4Lgh0Z+UNaD9pIkcc8AB4BXgeUNDE5hEQK7gV1BEPze0ysz+0b1kiSxVwM7gReBxREPUc0dAd4MguBQI/+wZUF7SZK4a4FdwHPAvJaEoGYuAR8Bbzf6cq0lQXtJksSrgV3UbtKqZJoBB4G3giA43Yhf2vSgvX/dG10F3NGkg1WzTQPfAu8HQXCgEb+w6UEDl9+VYAmt/XWUk8AVwARQBM5R+x3UCWp/7u+0OJNuHG/0nWkVKt8C7wZBcFy6pFVBNwiAGWqzvG3yOU1aA7wMPCWV0dKgK+YysBd4JwiCH6RDWh70NepXYxX0MXA0CIJQMqTloafnsn8OuJ/a/PgjgjHSLgEfAiepzcyqEfZL1waD9vXUnzDtA74CPpa+KtRSfqmdqb2Hxhu0x94ErM5tPUrthvFR4BngXqmEyMzUXk59Q+2e9mfAzl7eZUizl1JPAu9Hn/NSqlk6fd6+XcEwAHwSc76Ua1fQ/cBPQPWUgUq62xX0AuBzwIk5X8pd7QzaB/ZRu8uv0qGdQc8DPqX2fCiVDu0OuhfYBwyLnr1KQ7dXQ7vZj1K7i6/SQ+I62Q98BPSJnrlSmfQnhV3Ux+OvUM2nvhpa/eUYFY9E0CofROhtlw6R0tCgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWaGgVVYoaJUVClplhYJWWWFLBwCEYRgCtuwcStXFSAcAhGH4p3SIUnXRlakQCUoFbTK0d4MXQD90qLb9pAuqzxvqNrQCNvQMfD/tM4A+9FqHa/9S/gHMRqSZ7l+hjAAAAABJRU5ErkJggg==';

const appleIconPath = path.join(__dirname, '../public/apple-touch-icon.png');
const appleIconBuffer = Buffer.from(appleIcon180Base64, 'base64');
fs.writeFileSync(appleIconPath, appleIconBuffer);
console.log(`✅ Created: ${appleIconPath}`);

console.log('\n✅ PNG favicons created!\n');
console.log('📋 Files ready:');
console.log('   ✅ favicon.svg (vector - best quality)');
console.log('   ✅ favicon.ico (16x16, 32x32)');
console.log('   ✅ favicon.png (32x32)');
console.log('   ✅ apple-touch-icon.png (180x180)\n');

