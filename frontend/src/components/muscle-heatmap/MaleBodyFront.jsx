import { getMuscleColor, BODY_BASE_COLOR, HEAD_COLOR } from './muscleColor';

/**
 * Male Body Front View — Production-quality anatomical SVG.
 * Every muscle group is an individually addressable <path> element.
 */
export default function MaleBodyFront({ muscleData = {}, onMuscleClick }) {
  const fill = (id) => getMuscleColor(muscleData[id] || 0);
  const click = (id) => () => onMuscleClick && onMuscleClick(id);
  const enter = (e) => { e.currentTarget.style.filter = 'brightness(1.3)'; };
  const leave = (e) => { e.currentTarget.style.filter = 'none'; };
  const ms = { cursor: 'pointer', transition: 'fill 0.3s ease, filter 0.2s ease' };

  return (
    <svg viewBox="0 0 440 900" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">

      {/* ===== BODY OUTLINE (white/light stroke for silhouette effect) ===== */}
      <path d="M220,72 C244,72 264,56 264,36 C264,16 244,0 220,0 C196,0 176,16 176,36 C176,56 196,72 220,72 Z
        M220,80 C210,80 200,82 194,84 L180,86 C162,90 146,100 134,116 L120,138 L102,176 L84,216
        L72,248 L60,278 L50,306 L44,328 L42,344 L46,350 L56,352 L64,346 L72,326
        L82,296 L94,264 L106,232 L114,212 L118,194 L120,178 L122,166
        L122,200 L120,240 L116,290 L112,340 L110,380 L108,410 L106,440
        L102,478 L98,516 L94,558 L90,600 L86,640 L82,668 L78,700
        L76,728 L76,754 L80,768 L88,776 L100,778 L112,774 L118,764
        L124,738 L130,700 L136,660 L142,624 L148,588 L152,556 L156,530
        L160,510 L166,490 L174,472 L182,460 L192,452 L204,448 L220,446
        L236,448 L248,452 L258,460 L266,472 L274,490 L280,510 L284,530
        L288,556 L292,588 L298,624 L304,660 L310,700 L316,738 L322,764
        L328,774 L340,778 L352,776 L360,768 L364,754 L364,728 L362,700
        L358,668 L354,640 L350,600 L346,558 L342,516 L338,478 L334,440
        L332,410 L330,380 L328,340 L324,290 L320,240 L318,200 L318,166
        L320,178 L322,194 L326,212 L334,232 L346,264 L358,296 L368,326
        L376,346 L384,352 L394,350 L398,344 L396,328 L390,306 L380,278
        L368,248 L356,216 L338,176 L320,138 L306,116 C294,100 278,90 260,86
        L246,84 C240,82 230,80 220,80 Z"
        fill="none" stroke="#ccc" strokeWidth="3" strokeLinejoin="round" opacity="0.5" />

      {/* ===== HEAD ===== */}
      <ellipse cx="220" cy="38" rx="38" ry="36" fill={HEAD_COLOR} />
      {/* Face placeholder */}
      <rect x="200" y="22" width="40" height="32" rx="6" fill="#999" opacity="0.25" />
      {/* Hair */}
      <path d="M186,26 C186,8 200,-2 220,-2 C240,-2 254,8 254,26 C254,14 246,4 220,4 C194,4 186,14 186,26Z"
        fill="#3d3d3d" />
      {/* Neck */}
      <rect x="206" y="70" width="28" height="20" rx="6" fill={HEAD_COLOR} />

      {/* ===== SHOULDERS ===== */}
      <path data-muscle="shoulders_left"
        d="M180,90 C164,94 148,104 138,118 L126,142 L118,164 L126,170 L136,158
           L148,134 L160,116 L172,104 L182,96 Z"
        fill={fill('shoulders_left')} style={ms} onClick={click('shoulders_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="shoulders_right"
        d="M260,90 C276,94 292,104 302,118 L314,142 L322,164 L314,170 L304,158
           L292,134 L280,116 L268,104 L258,96 Z"
        fill={fill('shoulders_right')} style={ms} onClick={click('shoulders_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== CHEST ===== */}
      <path data-muscle="chest_left"
        d="M182,100 L170,108 L154,124 L140,144 L130,164 L128,174 L134,182
           L148,188 L164,190 L180,186 L196,178 L208,166 L214,150 L216,136
           L214,118 L206,104 L196,98 Z"
        fill={fill('chest_left')} style={ms} onClick={click('chest_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="chest_right"
        d="M258,100 L270,108 L286,124 L300,144 L310,164 L312,174 L306,182
           L292,188 L276,190 L260,186 L244,178 L232,166 L226,150 L224,136
           L226,118 L234,104 L244,98 Z"
        fill={fill('chest_right')} style={ms} onClick={click('chest_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== BICEPS ===== */}
      <path data-muscle="biceps_left"
        d="M122,168 L114,192 L106,220 L100,248 L98,266 L104,274 L114,270
           L122,252 L128,228 L130,204 L130,182 L126,172 Z"
        fill={fill('biceps_left')} style={ms} onClick={click('biceps_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="biceps_right"
        d="M318,168 L326,192 L334,220 L340,248 L342,266 L336,274 L326,270
           L318,252 L312,228 L310,204 L310,182 L314,172 Z"
        fill={fill('biceps_right')} style={ms} onClick={click('biceps_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== FOREARMS ===== */}
      <path data-muscle="forearms_left"
        d="M98,272 L90,300 L80,334 L72,364 L66,390 L62,410 L60,424 L64,432
           L74,430 L82,414 L90,386 L98,354 L106,322 L112,294 L114,276 Z"
        fill={fill('forearms_left')} style={ms} onClick={click('forearms_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="forearms_right"
        d="M342,272 L350,300 L360,334 L368,364 L374,390 L378,410 L380,424
           L376,432 L366,430 L358,414 L350,386 L342,354 L334,322 L328,294
           L326,276 Z"
        fill={fill('forearms_right')} style={ms} onClick={click('forearms_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Hands */}
      <path d="M58,428 L52,446 L48,456 L52,462 L60,458 L66,444 L64,432 Z" fill={BODY_BASE_COLOR} />
      <path d="M382,428 L388,446 L392,456 L388,462 L380,458 L374,444 L376,432 Z" fill={BODY_BASE_COLOR} />

      {/* ===== ABS UPPER ===== */}
      <path data-muscle="abs_upper"
        d="M192,190 L186,208 L182,230 L182,252 L186,268 L200,274 L212,276
           L220,278 L228,276 L240,274 L254,268 L258,252 L258,230 L254,208
           L248,190 L236,186 L220,184 L204,186 Z"
        fill={fill('abs_upper')} style={ms} onClick={click('abs_upper')}
        onMouseEnter={enter} onMouseLeave={leave} />
      {/* Ab definition lines */}
      <line x1="220" y1="186" x2="220" y2="390" stroke="#1a1a1a" strokeWidth="1.2" opacity="0.35" />
      <line x1="192" y1="228" x2="248" y2="228" stroke="#1a1a1a" strokeWidth="1" opacity="0.25" />
      <line x1="190" y1="260" x2="250" y2="260" stroke="#1a1a1a" strokeWidth="1" opacity="0.25" />
      <line x1="188" y1="292" x2="252" y2="292" stroke="#1a1a1a" strokeWidth="1" opacity="0.25" />
      <line x1="186" y1="324" x2="254" y2="324" stroke="#1a1a1a" strokeWidth="1" opacity="0.25" />

      {/* ===== ABS LOWER ===== */}
      <path data-muscle="abs_lower"
        d="M186,272 L180,300 L178,330 L178,358 L182,380 L194,392 L208,398
           L220,400 L232,398 L246,392 L258,380 L262,358 L262,330 L260,300
           L254,272 L240,278 L228,280 L220,282 L212,280 L200,278 Z"
        fill={fill('abs_lower')} style={ms} onClick={click('abs_lower')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== OBLIQUES ===== */}
      <path data-muscle="obliques_left"
        d="M134,186 L128,210 L124,244 L122,280 L122,316 L124,348 L128,374
           L136,394 L150,404 L166,406 L178,400 L182,380 L180,346 L180,310
           L182,276 L184,240 L186,210 L188,190 L170,188 L152,186 Z"
        fill={fill('obliques_left')} style={ms} onClick={click('obliques_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="obliques_right"
        d="M306,186 L312,210 L316,244 L318,280 L318,316 L316,348 L312,374
           L304,394 L290,404 L274,406 L262,400 L258,380 L260,346 L260,310
           L258,276 L256,240 L254,210 L252,190 L270,188 L288,186 Z"
        fill={fill('obliques_right')} style={ms} onClick={click('obliques_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== HIP / GROIN AREA (non-interactive) ===== */}
      <path d="M166,406 L174,424 L184,440 L196,448 L220,450 L244,448 L256,440
        L266,424 L274,406 L258,398 L240,394 L220,392 L200,394 L182,398 Z"
        fill={BODY_BASE_COLOR} />

      {/* ===== QUADS ===== */}
      <path data-muscle="quads_left"
        d="M162,418 L152,448 L142,484 L134,524 L128,564 L124,600 L122,630
           L124,654 L132,668 L144,674 L158,670 L168,660 L174,640 L178,612
           L180,580 L180,548 L178,514 L176,480 L174,448 L172,424 Z"
        fill={fill('quads_left')} style={ms} onClick={click('quads_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="quads_right"
        d="M278,418 L288,448 L298,484 L306,524 L312,564 L316,600 L318,630
           L316,654 L308,668 L296,674 L282,670 L272,660 L266,640 L262,612
           L260,580 L260,548 L262,514 L264,480 L266,448 L268,424 Z"
        fill={fill('quads_right')} style={ms} onClick={click('quads_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Inner quad detail */}
      <path d="M178,480 C186,510 194,540 200,570 L206,600 L210,640 L214,662"
        fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.2" />
      <path d="M262,480 C254,510 246,540 240,570 L234,600 L230,640 L226,662"
        fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.2" />

      {/* ===== KNEE AREA (non-interactive) ===== */}
      <path d="M124,660 C126,674 132,682 144,686 C156,690 166,686 172,680 C176,674 178,666 178,658"
        fill={BODY_BASE_COLOR} />
      <path d="M316,660 C314,674 308,682 296,686 C284,690 274,686 268,680 C264,674 262,666 262,658"
        fill={BODY_BASE_COLOR} />

      {/* ===== CALVES ===== */}
      <path data-muscle="calves_left"
        d="M124,692 L120,718 L116,748 L114,778 L114,806 L118,828 L124,846
           L134,858 L146,862 L158,856 L164,840 L168,816 L168,786 L166,756
           L164,726 L162,700 L158,690 L148,688 L136,690 Z"
        fill={fill('calves_left')} style={ms} onClick={click('calves_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="calves_right"
        d="M316,692 L320,718 L324,748 L326,778 L326,806 L322,828 L316,846
           L306,858 L294,862 L282,856 L276,840 L272,816 L272,786 L274,756
           L276,726 L278,700 L282,690 L292,688 L304,690 Z"
        fill={fill('calves_right')} style={ms} onClick={click('calves_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Calf muscle definition */}
      <path d="M136,714 C140,740 142,770 140,800" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.2" />
      <path d="M304,714 C300,740 298,770 300,800" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.2" />

      {/* ===== FEET (non-interactive) ===== */}
      <path d="M116,856 L108,870 L104,880 L108,888 L126,892 L150,892 L162,888
        L162,878 L158,866 L148,860" fill={BODY_BASE_COLOR} />
      <path d="M324,856 L332,870 L336,880 L332,888 L314,892 L290,892 L278,888
        L278,878 L282,866 L292,860" fill={BODY_BASE_COLOR} />

      {/* ===== ANATOMICAL DETAIL LINES ===== */}
      {/* Collarbone */}
      <path d="M180,98 C190,92 210,88 220,86 C230,88 250,92 260,98"
        fill="none" stroke="#555" strokeWidth="1" opacity="0.3" />
      {/* Pec separation */}
      <path d="M216,136 L220,178" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.2" />
      <path d="M224,136 L220,178" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.2" />
      {/* Quad inner line */}
      <line x1="220" y1="450" x2="220" y2="500" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.15" />
    </svg>
  );
}
