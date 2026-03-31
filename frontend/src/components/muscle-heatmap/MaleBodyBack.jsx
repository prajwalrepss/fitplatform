import { getMuscleColor, BODY_BASE_COLOR, HEAD_COLOR } from './muscleColor';

/**
 * Male Body Back View — Production-quality anatomical SVG.
 */
export default function MaleBodyBack({ muscleData = {}, onMuscleClick }) {
  const fill = (id) => getMuscleColor(muscleData[id] || 0);
  const click = (id) => () => onMuscleClick && onMuscleClick(id);
  const enter = (e) => { e.currentTarget.style.filter = 'brightness(1.3)'; };
  const leave = (e) => { e.currentTarget.style.filter = 'none'; };
  const ms = { cursor: 'pointer', transition: 'fill 0.3s ease, filter 0.2s ease' };

  return (
    <svg viewBox="0 0 440 900" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">

      {/* Body outline */}
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

      {/* Head */}
      <ellipse cx="220" cy="38" rx="38" ry="36" fill={HEAD_COLOR} />
      <path d="M186,30 C186,8 200,-2 220,-2 C240,-2 254,8 254,30 C254,16 246,4 220,4 C194,4 186,16 186,30Z"
        fill="#3d3d3d" />
      {/* Neck */}
      <rect x="206" y="70" width="28" height="20" rx="6" fill={HEAD_COLOR} />

      {/* ===== TRAPS ===== */}
      <path data-muscle="traps"
        d="M190,86 L174,92 L158,104 L146,120 L140,140 L148,154 L164,164
           L184,172 L200,178 L214,180 L220,182 L226,180 L240,178 L256,172
           L276,164 L292,154 L300,140 L294,120 L282,104 L266,92 L250,86
           L236,82 L220,80 L204,82 Z"
        fill={fill('traps')} style={ms} onClick={click('traps')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== REAR DELTS ===== */}
      <path data-muscle="rear_delts_left"
        d="M156,106 L142,118 L132,136 L126,158 L124,172 L132,180 L144,172
           L154,156 L160,138 L162,120 Z"
        fill={fill('rear_delts_left')} style={ms} onClick={click('rear_delts_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="rear_delts_right"
        d="M284,106 L298,118 L308,136 L314,158 L316,172 L308,180 L296,172
           L286,156 L280,138 L278,120 Z"
        fill={fill('rear_delts_right')} style={ms} onClick={click('rear_delts_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== LATS ===== */}
      <path data-muscle="lats_left"
        d="M146,168 L138,192 L132,222 L130,256 L132,290 L136,320 L142,344
           L152,360 L166,368 L180,370 L192,364 L198,348 L202,320 L204,288
           L204,256 L202,222 L198,196 L194,180 L180,172 L164,168 Z"
        fill={fill('lats_left')} style={ms} onClick={click('lats_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="lats_right"
        d="M294,168 L302,192 L308,222 L310,256 L308,290 L304,320 L298,344
           L288,360 L274,368 L260,370 L248,364 L242,348 L238,320 L236,288
           L236,256 L238,222 L242,196 L246,180 L260,172 L276,168 Z"
        fill={fill('lats_right')} style={ms} onClick={click('lats_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Spine */}
      <line x1="220" y1="180" x2="220" y2="400" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.3" />

      {/* ===== TRICEPS ===== */}
      <path data-muscle="triceps_left"
        d="M126,176 L116,204 L108,238 L104,266 L104,284 L110,292 L122,288
           L130,268 L134,242 L136,214 L136,190 L132,180 Z"
        fill={fill('triceps_left')} style={ms} onClick={click('triceps_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="triceps_right"
        d="M314,176 L324,204 L332,238 L336,266 L336,284 L330,292 L318,288
           L310,268 L306,242 L304,214 L304,190 L308,180 Z"
        fill={fill('triceps_right')} style={ms} onClick={click('triceps_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Forearms (non-interactive on back view) */}
      <path d="M104,290 L94,320 L84,356 L76,386 L70,410 L66,428 L70,436
        L80,434 L88,416 L96,386 L106,350 L114,318 L118,296 Z" fill={BODY_BASE_COLOR} />
      <path d="M336,290 L346,320 L356,356 L364,386 L370,410 L374,428 L370,436
        L360,434 L352,416 L344,386 L334,350 L326,318 L322,296 Z" fill={BODY_BASE_COLOR} />
      {/* Hands */}
      <path d="M64,432 L58,450 L54,460 L58,466 L66,462 L72,448 L70,436 Z" fill={BODY_BASE_COLOR} />
      <path d="M376,432 L382,450 L386,460 L382,466 L374,462 L368,448 L370,436 Z" fill={BODY_BASE_COLOR} />

      {/* ===== LOWER BACK ===== */}
      <path data-muscle="lower_back"
        d="M192,350 L184,376 L180,404 L182,428 L190,440 L204,448 L220,450
           L236,448 L250,440 L258,428 L260,404 L256,376 L248,350 L236,344
           L220,342 L204,344 Z"
        fill={fill('lower_back')} style={ms} onClick={click('lower_back')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== GLUTES ===== */}
      <path data-muscle="glutes_left"
        d="M166,438 L154,464 L146,496 L144,526 L150,548 L162,560 L178,564
           L194,558 L206,544 L214,524 L218,500 L218,476 L212,454 L202,442 Z"
        fill={fill('glutes_left')} style={ms} onClick={click('glutes_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="glutes_right"
        d="M274,438 L286,464 L294,496 L296,526 L290,548 L278,560 L262,564
           L246,558 L234,544 L226,524 L222,500 L222,476 L228,454 L238,442 Z"
        fill={fill('glutes_right')} style={ms} onClick={click('glutes_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Glute crease line */}
      <path d="M220,450 L220,520" fill="none" stroke="#1a1a1a" strokeWidth="1" opacity="0.2" />

      {/* ===== HAMSTRINGS ===== */}
      <path data-muscle="hamstrings_left"
        d="M148,560 L140,590 L134,624 L130,658 L130,688 L136,706 L148,714
           L162,712 L174,704 L180,684 L182,656 L182,624 L180,592 L176,566 Z"
        fill={fill('hamstrings_left')} style={ms} onClick={click('hamstrings_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="hamstrings_right"
        d="M292,560 L300,590 L306,624 L310,658 L310,688 L304,706 L292,714
           L278,712 L266,704 L260,684 L258,656 L258,624 L260,592 L264,566 Z"
        fill={fill('hamstrings_right')} style={ms} onClick={click('hamstrings_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Hamstring definition */}
      <path d="M158,580 C160,620 158,660 156,696" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.2" />
      <path d="M282,580 C280,620 282,660 284,696" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.2" />

      {/* Knee area */}
      <path d="M130,712 C134,726 142,734 154,736 C166,738 174,734 178,726 C180,720 182,712 182,706"
        fill={BODY_BASE_COLOR} />
      <path d="M310,712 C306,726 298,734 286,736 C274,738 266,734 262,726 C260,720 258,712 258,706"
        fill={BODY_BASE_COLOR} />

      {/* ===== CALVES ===== */}
      <path data-muscle="calves_left"
        d="M130,740 L126,768 L122,798 L122,828 L124,852 L130,870 L140,880
           L152,882 L164,876 L170,858 L174,832 L174,800 L172,770 L170,746
           L166,738 L154,736 L140,738 Z"
        fill={fill('calves_left')} style={ms} onClick={click('calves_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="calves_right"
        d="M310,740 L314,768 L318,798 L318,828 L316,852 L310,870 L300,880
           L288,882 L276,876 L270,858 L266,832 L266,800 L268,770 L270,746
           L274,738 L286,736 L300,738 Z"
        fill={fill('calves_right')} style={ms} onClick={click('calves_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Feet */}
      <path d="M124,878 L116,888 L112,896 L118,900 L140,900 L158,898 L166,892
        L166,884 L160,878 L150,880" fill={BODY_BASE_COLOR} />
      <path d="M316,878 L324,888 L328,896 L322,900 L300,900 L282,898 L274,892
        L274,884 L280,878 L290,880" fill={BODY_BASE_COLOR} />
    </svg>
  );
}
