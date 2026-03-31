import { getMuscleColor, BODY_BASE_COLOR, HEAD_COLOR } from './muscleColor';

/**
 * Female Body Front View — Production-quality anatomical SVG.
 * Narrower shoulders, wider hips, tapered waist.
 */
export default function FemaleBodyFront({ muscleData = {}, onMuscleClick }) {
  const fill = (id) => getMuscleColor(muscleData[id] || 0);
  const click = (id) => () => onMuscleClick && onMuscleClick(id);
  const enter = (e) => { e.currentTarget.style.filter = 'brightness(1.3)'; };
  const leave = (e) => { e.currentTarget.style.filter = 'none'; };
  const ms = { cursor: 'pointer', transition: 'fill 0.3s ease, filter 0.2s ease' };

  return (
    <svg viewBox="0 0 440 900" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">

      {/* Body outline */}
      <path d="M220,68 C242,68 258,54 258,34 C258,14 242,0 220,0 C198,0 182,14 182,34 C182,54 198,68 220,68 Z
        M220,76 C212,76 204,78 198,80 L186,84 C170,88 156,96 144,110 L132,130 L116,166 L100,204
        L88,234 L76,262 L66,288 L60,310 L58,326 L62,332 L70,334 L78,328
        L86,310 L96,282 L108,250 L118,222 L124,204 L128,190 L130,176
        L130,200 L128,236 L126,276 L124,316 L124,348 L124,374 L122,408
        L118,448 L114,490 L110,536 L106,578 L102,618 L98,648 L94,680
        L92,710 L92,738 L96,752 L104,760 L116,762 L126,756 L132,742
        L138,710 L144,674 L150,638 L156,604 L160,574 L164,548 L168,526
        L172,508 L178,490 L186,474 L196,460 L208,452 L220,450
        L232,452 L244,460 L254,474 L262,490 L268,508 L272,526 L276,548
        L280,574 L284,604 L290,638 L296,674 L302,710 L308,742 L314,756
        L324,762 L336,760 L344,752 L348,738 L348,710 L346,680 L342,648
        L338,618 L334,578 L330,536 L326,490 L322,448 L318,408 L316,374
        L316,348 L316,316 L314,276 L312,236 L310,200 L310,176 L312,190
        L316,204 L322,222 L332,250 L344,282 L354,310 L362,328 L370,334
        L378,332 L382,326 L380,310 L374,288 L364,262 L352,234 L340,204
        L324,166 L308,130 L296,110 C284,96 270,88 254,84 L242,80 C236,78 228,76 220,76 Z"
        fill="none" stroke="#ccc" strokeWidth="3" strokeLinejoin="round" opacity="0.5" />

      {/* Head */}
      <ellipse cx="220" cy="34" rx="34" ry="32" fill={HEAD_COLOR} />
      {/* Hair */}
      <path d="M188,24 C184,6 198,-4 220,-4 C242,-4 256,6 252,24
        C258,12 252,0 240,-4 C228,-8 212,-8 200,-4 C188,0 182,12 188,24 Z" fill="#3a3a3a" />
      <path d="M186,28 C184,40 186,52 190,60 L188,46 C186,36 186,30 188,24 Z" fill="#3a3a3a" opacity="0.7" />
      <path d="M254,28 C256,40 254,52 250,60 L252,46 C254,36 254,30 252,24 Z" fill="#3a3a3a" opacity="0.7" />
      {/* Neck */}
      <rect x="208" y="64" width="24" height="18" rx="5" fill={HEAD_COLOR} />

      {/* ===== SHOULDERS ===== */}
      <path data-muscle="shoulders_left"
        d="M186,86 C172,90 158,98 148,112 L138,132 L132,152 L140,158 L150,144
           L160,126 L172,110 L184,100 Z"
        fill={fill('shoulders_left')} style={ms} onClick={click('shoulders_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="shoulders_right"
        d="M254,86 C268,90 282,98 292,112 L302,132 L308,152 L300,158 L290,144
           L280,126 L268,110 L256,100 Z"
        fill={fill('shoulders_right')} style={ms} onClick={click('shoulders_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== CHEST ===== */}
      <path data-muscle="chest_left"
        d="M188,96 L176,104 L162,118 L150,136 L142,154 L140,164 L146,172
           L160,178 L176,180 L192,176 L206,168 L214,154 L218,140 L218,124
           L214,110 L204,100 Z"
        fill={fill('chest_left')} style={ms} onClick={click('chest_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="chest_right"
        d="M252,96 L264,104 L278,118 L290,136 L298,154 L300,164 L294,172
           L280,178 L264,180 L248,176 L234,168 L226,154 L222,140 L222,124
           L226,110 L236,100 Z"
        fill={fill('chest_right')} style={ms} onClick={click('chest_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== BICEPS ===== */}
      <path data-muscle="biceps_left"
        d="M134,158 L128,180 L122,206 L118,230 L118,248 L124,256 L134,252
           L140,236 L144,214 L146,192 L144,172 L140,162 Z"
        fill={fill('biceps_left')} style={ms} onClick={click('biceps_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="biceps_right"
        d="M306,158 L312,180 L318,206 L322,230 L322,248 L316,256 L306,252
           L300,236 L296,214 L294,192 L296,172 L300,162 Z"
        fill={fill('biceps_right')} style={ms} onClick={click('biceps_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== FOREARMS ===== */}
      <path data-muscle="forearms_left"
        d="M118,254 L110,280 L102,310 L96,338 L90,362 L88,378 L92,386
           L100,384 L108,366 L114,340 L120,312 L126,284 L128,260 Z"
        fill={fill('forearms_left')} style={ms} onClick={click('forearms_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="forearms_right"
        d="M322,254 L330,280 L338,310 L344,338 L350,362 L352,378 L348,386
           L340,384 L332,366 L326,340 L320,312 L314,284 L312,260 Z"
        fill={fill('forearms_right')} style={ms} onClick={click('forearms_right')}
        onMouseEnter={enter} onMouseLeave={leave} />
      {/* Hands */}
      <path d="M86,382 L80,398 L78,408 L82,412 L90,408 L94,396 L92,386 Z" fill={BODY_BASE_COLOR} />
      <path d="M354,382 L360,398 L362,408 L358,412 L350,408 L346,396 L348,386 Z" fill={BODY_BASE_COLOR} />

      {/* ===== ABS UPPER ===== */}
      <path data-muscle="abs_upper"
        d="M198,180 L192,198 L190,220 L190,242 L194,258 L206,264 L216,266
           L220,268 L224,266 L234,264 L246,258 L250,242 L250,220 L248,198
           L242,180 L232,176 L220,174 L208,176 Z"
        fill={fill('abs_upper')} style={ms} onClick={click('abs_upper')}
        onMouseEnter={enter} onMouseLeave={leave} />
      {/* Ab lines */}
      <line x1="220" y1="176" x2="220" y2="380" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
      <line x1="198" y1="218" x2="242" y2="218" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.2" />
      <line x1="196" y1="248" x2="244" y2="248" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.2" />
      <line x1="194" y1="280" x2="246" y2="280" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.2" />
      <line x1="192" y1="312" x2="248" y2="312" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.2" />

      {/* ===== ABS LOWER ===== */}
      <path data-muscle="abs_lower"
        d="M194,262 L190,290 L188,320 L188,348 L192,370 L204,382 L214,388
           L220,390 L226,388 L236,382 L248,370 L252,348 L252,320 L250,290
           L246,262 L234,268 L224,270 L220,272 L216,270 L206,268 Z"
        fill={fill('abs_lower')} style={ms} onClick={click('abs_lower')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== OBLIQUES (narrow waist) ===== */}
      <path data-muscle="obliques_left"
        d="M148,176 L142,204 L138,238 L136,276 L136,310 L138,342 L142,368
           L150,388 L164,398 L178,400 L188,394 L192,376 L192,340 L192,306
           L192,272 L194,238 L196,206 L198,184 L180,180 L162,178 Z"
        fill={fill('obliques_left')} style={ms} onClick={click('obliques_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="obliques_right"
        d="M292,176 L298,204 L302,238 L304,276 L304,310 L302,342 L298,368
           L290,388 L276,398 L262,400 L252,394 L248,376 L248,340 L248,306
           L248,272 L246,238 L244,206 L242,184 L260,180 L278,178 Z"
        fill={fill('obliques_right')} style={ms} onClick={click('obliques_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Hip area */}
      <path d="M170,398 L180,418 L194,436 L208,448 L220,450 L232,448 L246,436
        L260,418 L270,398 L252,390 L236,384 L220,382 L204,384 L188,390 Z"
        fill={BODY_BASE_COLOR} />

      {/* ===== QUADS (wider hips) ===== */}
      <path data-muscle="quads_left"
        d="M164,426 L152,458 L142,494 L136,534 L132,572 L130,608 L130,636
           L134,658 L142,672 L154,678 L168,674 L178,664 L182,646 L186,618
           L188,586 L188,554 L186,520 L184,486 L182,456 L178,434 Z"
        fill={fill('quads_left')} style={ms} onClick={click('quads_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="quads_right"
        d="M276,426 L288,458 L298,494 L304,534 L308,572 L310,608 L310,636
           L306,658 L298,672 L286,678 L272,674 L262,664 L258,646 L254,618
           L252,586 L252,554 L254,520 L256,486 L258,456 L262,434 Z"
        fill={fill('quads_right')} style={ms} onClick={click('quads_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Quad inner detail */}
      <path d="M186,490 C192,520 196,556 198,590 L200,630 L202,660"
        fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.18" />
      <path d="M254,490 C248,520 244,556 242,590 L240,630 L238,660"
        fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.18" />

      {/* Knee */}
      <path d="M130,668 C134,680 142,688 154,690 C166,692 176,688 182,680 C184,674 186,668 186,662"
        fill={BODY_BASE_COLOR} />
      <path d="M310,668 C306,680 298,688 286,690 C274,692 264,688 258,680 C256,674 254,668 254,662"
        fill={BODY_BASE_COLOR} />

      {/* ===== CALVES ===== */}
      <path data-muscle="calves_left"
        d="M130,696 L126,722 L124,752 L124,780 L126,806 L130,826 L138,840
           L148,848 L160,848 L170,842 L176,826 L178,800 L178,772 L176,744
           L174,720 L172,702 L166,694 L154,692 L140,694 Z"
        fill={fill('calves_left')} style={ms} onClick={click('calves_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="calves_right"
        d="M310,696 L314,722 L316,752 L316,780 L314,806 L310,826 L302,840
           L292,848 L280,848 L270,842 L264,826 L262,800 L262,772 L264,744
           L266,720 L268,702 L274,694 L286,692 L300,694 Z"
        fill={fill('calves_right')} style={ms} onClick={click('calves_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Feet */}
      <path d="M124,844 L118,858 L114,868 L118,874 L136,878 L156,876 L166,870
        L166,860 L162,850 L154,846" fill={BODY_BASE_COLOR} />
      <path d="M316,844 L322,858 L326,868 L322,874 L304,878 L284,876 L274,870
        L274,860 L278,850 L286,846" fill={BODY_BASE_COLOR} />

      {/* Collarbone detail */}
      <path d="M190,94 C200,88 212,84 220,82 C228,84 240,88 250,94"
        fill="none" stroke="#555" strokeWidth="0.8" opacity="0.25" />
    </svg>
  );
}
