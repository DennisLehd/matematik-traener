// ============================================================
// MATEMATIK-TRÆNER
// ============================================================


// ------------------------------------------------------------
// DOM
// ------------------------------------------------------------

const setupScreen =
  document.getElementById("setupScreen");

const trainingScreen =
  document.getElementById("trainingScreen");

const finishedScreen =
  document.getElementById("finishedScreen");

const moduleGrid =
  document.getElementById("moduleGrid");

const optionsPanel =
  document.getElementById("optionsPanel");

const selectedModuleTitle =
  document.getElementById("selectedModuleTitle");

const exerciseType =
  document.getElementById("exerciseType");

const difficulty =
  document.getElementById("difficulty");

const questionCount =
  document.getElementById("questionCount");

const startButton =
  document.getElementById("startButton");

const changeModuleButton =
  document.getElementById("changeModuleButton");

const trainingModule =
  document.getElementById("trainingModule");

const progressText =
  document.getElementById("progressText");

const progressFill =
  document.getElementById("progressFill");

const exerciseTitle =
  document.getElementById("exerciseTitle");

const problem =
  document.getElementById("problem");

const instruction =
  document.getElementById("instruction");

const answerButton =
  document.getElementById("answerButton");

const nextButton =
  document.getElementById("nextButton");

const answerBox =
  document.getElementById("answerBox");

const quitButton =
  document.getElementById("quitButton");

const finishedText =
  document.getElementById("finishedText");

const repeatButton =
  document.getElementById("repeatButton");

const homeButton =
  document.getElementById("homeButton");


// ------------------------------------------------------------
// SESSION
// ------------------------------------------------------------

let selectedModule = null;

let session = {
  module: null,
  exercise: null,
  difficulty: "medium",
  total: 10,
  current: 0
};

let currentQuestion = null;


// ============================================================
// HJÆLPEFUNKTIONER
// ============================================================

function randomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}


function randomItem(array) {
  return array[
    randomInt(0, array.length - 1)
  ];
}


function gcd(a, b) {

  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {

    const temporary = b;

    b = a % b;
    a = temporary;
  }

  return a;
}


function simplifyFraction(
  numerator,
  denominator
) {

  if (denominator < 0) {
    numerator *= -1;
    denominator *= -1;
  }

  const divisor =
    gcd(numerator, denominator);

  return {
    numerator:
      numerator / divisor,

    denominator:
      denominator / divisor
  };
}


function fractionHTML(
  numerator,
  denominator
) {

  if (denominator === 1) {
    return `${numerator}`;
  }

  return `
    <span class="fraction">
      <span class="fraction-top">
        ${numerator}
      </span>

      <span class="fraction-bottom">
        ${denominator}
      </span>
    </span>
  `;
}


function mixedHTML(
  whole,
  numerator,
  denominator
) {

  if (numerator === 0) {
    return `${whole}`;
  }

  return `
    <span class="mixed-number">
      ${whole}
      ${fractionHTML(
        numerator,
        denominator
      )}
    </span>
  `;
}


function fractionAnswer(
  numerator,
  denominator,
  showMixed = true
) {

  const result =
    simplifyFraction(
      numerator,
      denominator
    );

  const n = result.numerator;
  const d = result.denominator;

  if (d === 1) {
    return `${n}`;
  }

  if (
    showMixed &&
    Math.abs(n) > d
  ) {

    const whole =
      Math.trunc(n / d);

    const remainder =
      Math.abs(n % d);

    if (remainder === 0) {
      return `${whole}`;
    }

    return `
      ${fractionHTML(n, d)}
      <span class="operator">=</span>
      ${mixedHTML(
        whole,
        remainder,
        d
      )}
    `;
  }

  return fractionHTML(n, d);
}


function difficultyRange() {

  if (session.difficulty === "easy") {

    return {
      small: 10,
      medium: 20,
      large: 100,
      denominator: 8
    };
  }

  if (session.difficulty === "hard") {

    return {
      small: 30,
      medium: 100,
      large: 1000,
      denominator: 20
    };
  }

  return {
    small: 20,
    medium: 50,
    large: 500,
    denominator: 12
  };
}


// ============================================================
// OPGAVEMODULER
// ============================================================

const modules = {

  // ----------------------------------------------------------
  // GRUNDREGNING
  // ----------------------------------------------------------

  arithmetic: {

    title: "Grundregning",

    icon: "➕",

    description:
      "Plus, minus, gange og division.",

    exercises: {

      mixed: "Blandede opgaver",

      add: "Læg sammen",

      subtract: "Træk fra",

      multiply: "Gang",

      divide: "Divider"
    },

    generators: {

      add() {

        const range =
          difficultyRange();

        const a =
          randomInt(1, range.medium);

        const b =
          randomInt(1, range.medium);

        return {
          title: "Læg tallene sammen",
          problem: `${a} + ${b}`,
          answer: `${a + b}`,
          instruction: ""
        };
      },


      subtract() {

        const range =
          difficultyRange();

        let a =
          randomInt(2, range.medium);

        let b =
          randomInt(1, range.medium);

        if (b > a) {
          [a, b] = [b, a];
        }

        return {
          title: "Træk fra",
          problem: `${a} − ${b}`,
          answer: `${a - b}`,
          instruction: ""
        };
      },


      multiply() {

        const range =
          difficultyRange();

        const max =
          session.difficulty === "easy"
            ? 10
            : session.difficulty === "hard"
              ? 20
              : 12;

        const a = randomInt(2, max);
        const b = randomInt(2, max);

        return {
          title: "Gang tallene",
          problem: `${a} × ${b}`,
          answer: `${a * b}`,
          instruction: ""
        };
      },


      divide() {

        const range =
          difficultyRange();

        const divisor =
          randomInt(
            2,
            session.difficulty === "hard"
              ? 20
              : 12
          );

        const result =
          randomInt(2, range.small);

        const dividend =
          divisor * result;

        return {
          title: "Divider",
          problem:
            `${dividend} ÷ ${divisor}`,

          answer:
            `${result}`,

          instruction:
            "Divisionen går op uden rest."
        };
      }
    }
  },


  // ----------------------------------------------------------
  // DIVISION
  // ----------------------------------------------------------

  division: {

    title: "Division",

    icon: "➗",

    description:
      "Division, division med rest og større tal.",

    exercises: {

      mixed: "Blandede divisionsopgaver",

      exact: "Division uden rest",

      remainder: "Division med rest",

      large: "Division med større tal"
    },

    generators: {

      exact() {

        const range =
          difficultyRange();

        const divisor =
          randomInt(2, 15);

        const result =
          randomInt(2, range.small);

        const dividend =
          divisor * result;

        return {
          title: "Division uden rest",

          problem:
            `${dividend} ÷ ${divisor}`,

          answer:
            `${result}`,

          instruction:
            "Resultatet er et helt tal."
        };
      },


      remainder() {

        const divisor =
          randomInt(
            2,
            session.difficulty === "hard"
              ? 20
              : 12
          );

        const result =
          randomInt(
            2,
            session.difficulty === "easy"
              ? 10
              : 20
          );

        const remainder =
          randomInt(
            1,
            divisor - 1
          );

        const dividend =
          divisor * result + remainder;

        return {
          title: "Division med rest",

          problem:
            `${dividend} ÷ ${divisor}`,

          answer:
            `${result} rest ${remainder}`,

          instruction:
            "Angiv både resultat og rest."
        };
      },


      large() {

        const divisor =
          randomInt(
            2,
            session.difficulty === "easy"
              ? 9
              : 25
          );

        const result =
          randomInt(
            session.difficulty === "easy"
              ? 10
              : 20,

            session.difficulty === "hard"
              ? 150
              : 80
          );

        const dividend =
          divisor * result;

        return {
          title: "Division med større tal",

          problem:
            `${dividend} ÷ ${divisor}`,

          answer:
            `${result}`,

          instruction:
            "Regn gerne divisionen på papir."
        };
      }
    }
  },


  // ----------------------------------------------------------
  // BRØKER
  // ----------------------------------------------------------

  fractions: {

    title: "Brøker",

    icon: "½",

    description:
      "Forkort, forlæng og regn med brøker.",

    exercises: {

      mixed:
        "Blandede brøkopgaver",

      reduce:
        "Forkort en brøk",

      extend:
        "Forlæng en brøk",

      add:
        "Læg brøker sammen",

      subtract:
        "Træk brøker fra hinanden",

      multiply:
        "Gang brøker",

      divide:
        "Brøk ÷ brøk",

      numberDivideFraction:
        "Tal ÷ brøk",

      fractionDivideNumber:
        "Brøk ÷ tal",

      improperToMixed:
        "Uægte brøk → blandet tal",

      mixedToImproper:
        "Blandet tal → uægte brøk"
    },

    generators: {

      reduce() {

        const max =
          difficultyRange().denominator;

        let baseDenominator =
          randomInt(2, max);

        let baseNumerator =
          randomInt(
            1,
            baseDenominator - 1
          );

        let reduced =
          simplifyFraction(
            baseNumerator,
            baseDenominator
          );

        baseNumerator =
          reduced.numerator;

        baseDenominator =
          reduced.denominator;

        const factor =
          randomInt(2, 7);

        const numerator =
          baseNumerator * factor;

        const denominator =
          baseDenominator * factor;

        return {
          title:
            "Forkort brøken mest muligt",

          problem:
            fractionHTML(
              numerator,
              denominator
            ),

          answer:
            fractionHTML(
              baseNumerator,
              baseDenominator
            ),

          instruction:
            "Find det største tal, som både tæller og nævner kan divideres med."
        };
      },


      extend() {

        const max =
          difficultyRange().denominator;

        const denominator =
          randomInt(2, max);

        const numerator =
          randomInt(
            1,
            denominator - 1
          );

        const factor =
          randomInt(2, 8);

        return {
          title:
            "Forlæng brøken",

          problem:
            `
            ${fractionHTML(
              numerator,
              denominator
            )}

            <span class="operator">
              med ${factor}
            </span>
            `,

          answer:
            fractionHTML(
              numerator * factor,
              denominator * factor
            ),

          instruction:
            `Gang både tæller og nævner med ${factor}.`
        };
      },


      add() {

        const max =
          difficultyRange().denominator;

        const d1 =
          randomInt(2, max);

        const d2 =
          randomInt(2, max);

        const n1 =
          randomInt(1, d1 - 1);

        const n2 =
          randomInt(1, d2 - 1);

        const numerator =
          n1 * d2 + n2 * d1;

        const denominator =
          d1 * d2;

        return {
          title:
            "Læg brøkerne sammen",

          problem:
            `
            ${fractionHTML(n1, d1)}
            <span class="operator">+</span>
            ${fractionHTML(n2, d2)}
            `,

          answer:
            fractionAnswer(
              numerator,
              denominator
            ),

          instruction:
            "Find en fællesnævner og forkort resultatet."
        };
      },


      subtract() {

        const max =
          difficultyRange().denominator;

        let n1;
        let d1;
        let n2;
        let d2;

        do {

          d1 =
            randomInt(2, max);

          d2 =
            randomInt(2, max);

          n1 =
            randomInt(1, d1 - 1);

          n2 =
            randomInt(1, d2 - 1);

        } while (
          n1 / d1 <= n2 / d2
        );

        const numerator =
          n1 * d2 - n2 * d1;

        const denominator =
          d1 * d2;

        return {
          title:
            "Træk brøkerne fra hinanden",

          problem:
            `
            ${fractionHTML(n1, d1)}
            <span class="operator">−</span>
            ${fractionHTML(n2, d2)}
            `,

          answer:
            fractionAnswer(
              numerator,
              denominator
            ),

          instruction:
            "Find en fællesnævner og forkort resultatet."
        };
      },


      multiply() {

        const max =
          difficultyRange().denominator;

        const d1 =
          randomInt(2, max);

        const d2 =
          randomInt(2, max);

        const n1 =
          randomInt(1, d1 - 1);

        const n2 =
          randomInt(1, d2 - 1);

        return {
          title:
            "Gang brøkerne",

          problem:
            `
            ${fractionHTML(n1, d1)}
            <span class="operator">×</span>
            ${fractionHTML(n2, d2)}
            `,

          answer:
            fractionAnswer(
              n1 * n2,
              d1 * d2
            ),

          instruction:
            "Gang tæller med tæller og nævner med nævner."
        };
      },


      divide() {

        const max =
          difficultyRange().denominator;

        const d1 =
          randomInt(2, max);

        const d2 =
          randomInt(2, max);

        const n1 =
          randomInt(1, d1 - 1);

        const n2 =
          randomInt(1, d2 - 1);

        return {
          title:
            "Divider brøkerne",

          problem:
            `
            ${fractionHTML(n1, d1)}
            <span class="operator">÷</span>
            ${fractionHTML(n2, d2)}
            `,

          answer:
            fractionAnswer(
              n1 * d2,
              d1 * n2
            ),

          instruction:
            "Vend den anden brøk om og gang."
        };
      },


      numberDivideFraction() {

        const range =
          difficultyRange();

        const number =
          randomInt(
            2,
            range.small
          );

        const denominator =
          randomInt(
            2,
            range.denominator
          );

        const numerator =
          randomInt(
            1,
            denominator - 1
          );

        return {
          title:
            "Divider et tal med en brøk",

          problem:
            `
            ${number}

            <span class="operator">
              ÷
            </span>

            ${fractionHTML(
              numerator,
              denominator
            )}
            `,

          answer:
            fractionAnswer(
              number * denominator,
              numerator
            ),

          instruction:
            "Skriv det hele tal som en brøk med nævneren 1 og vend den anden brøk."
        };
      },


      fractionDivideNumber() {

        const range =
          difficultyRange();

        const denominator =
          randomInt(
            2,
            range.denominator
          );

        const numerator =
          randomInt(
            1,
            denominator - 1
          );

        const number =
          randomInt(
            2,
            range.small
          );

        return {
          title:
            "Divider en brøk med et tal",

          problem:
            `
            ${fractionHTML(
              numerator,
              denominator
            )}

            <span class="operator">
              ÷
            </span>

            ${number}
            `,

          answer:
            fractionAnswer(
              numerator,
              denominator * number,
              false
            ),

          instruction:
            "Skriv det hele tal som en brøk med nævneren 1."
        };
      },


      improperToMixed() {

        const max =
          difficultyRange().denominator;

        const denominator =
          randomInt(2, max);

        const whole =
          randomInt(
            1,
            session.difficulty === "hard"
              ? 12
              : 6
          );

        const remainder =
          randomInt(
            1,
            denominator - 1
          );

        const numerator =
          whole * denominator
          + remainder;

        const simplified =
          simplifyFraction(
            remainder,
            denominator
          );

        return {
          title:
            "Omskriv til blandet tal",

          problem:
            fractionHTML(
              numerator,
              denominator
            ),

          answer:
            mixedHTML(
              whole,
              simplified.numerator,
              simplified.denominator
            ),

          instruction:
            "Hvor mange hele gange går nævneren op i tælleren?"
        };
      },


      mixedToImproper() {

        const max =
          difficultyRange().denominator;

        const denominator =
          randomInt(2, max);

        const numerator =
          randomInt(
            1,
            denominator - 1
          );

        const whole =
          randomInt(
            1,
            session.difficulty === "hard"
              ? 12
              : 7
          );

        return {
          title:
            "Omskriv til uægte brøk",

          problem:
            mixedHTML(
              whole,
              numerator,
              denominator
            ),

          answer:
            fractionHTML(
              whole * denominator
              + numerator,
              denominator
            ),

          instruction:
            "Gang det hele tal med nævneren og læg tælleren til."
        };
      }
    }
  },


  // ----------------------------------------------------------
  // POTENSER OG RØDDER
  // ----------------------------------------------------------

  powers: {

    title:
      "Potenser og rødder",

    icon:
      "x²",

    description:
      "Potens, kvadratrod og tierpotenser.",

    exercises: {

      mixed:
        "Blandede opgaver",

      powers:
        "Potenser",

      roots:
        "Kvadratrødder",

      powersOfTen:
        "Tierpotenser"
    },

    generators: {

      powers() {

        const hard =
          session.difficulty === "hard";

        const base =
          randomInt(
            2,
            hard ? 12 : 10
          );

        const exponent =
          randomInt(
            2,
            hard ? 4 : 3
          );

        return {
          title:
            "Beregn potensen",

          problem:
            `${base}<sup>${exponent}</sup>`,

          answer:
            `${base ** exponent}`,

          instruction:
            `${base} skal ganges med sig selv ${exponent} gange.`
        };
      },


      roots() {

        const maximum =
          session.difficulty === "hard"
            ? 20
            : session.difficulty === "medium"
              ? 15
              : 10;

        const root =
          randomInt(2, maximum);

        const number =
          root * root;

        return {
          title:
            "Find kvadratroden",

          problem:
            `√${number}`,

          answer:
            `${root}`,

          instruction:
            "Hvilket tal ganget med sig selv giver tallet under roden?"
        };
      },


      powersOfTen() {

        const exponent =
          randomInt(
            1,
            session.difficulty === "hard"
              ? 8
              : 6
          );

        const answer =
          10 ** exponent;

        return {
          title:
            "Beregn tierpotensen",

          problem:
            `10<sup>${exponent}</sup>`,

          answer:
            answer.toLocaleString("da-DK"),

          instruction:
            "En tierpotens kan skrives som 1 efterfulgt af nuller."
        };
      }
    }
  },


  // ----------------------------------------------------------
  // GEOMETRI
  // ----------------------------------------------------------

  geometry: {

    title:
      "Geometri",

    icon:
      "△",

    description:
      "Omkreds og areal af enkle figurer.",

    exercises: {

      mixed:
        "Blandede geometriopgaver",

      rectangleArea:
        "Areal af rektangel",

      rectanglePerimeter:
        "Omkreds af rektangel",

      triangleArea:
        "Areal af trekant",

      square:
        "Kvadrat"
    },

    generators: {

      rectangleArea() {

        const max =
          session.difficulty === "hard"
            ? 40
            : 20;

        const width =
          randomInt(2, max);

        const height =
          randomInt(2, max);

        return {
          title:
            "Find rektanglets areal",

          problem:
            `
            <div class="geometry-lines">
              Længde: ${width} cm<br>
              Bredde: ${height} cm
            </div>
            `,

          answer:
            `${width * height} cm²`,

          instruction:
            "Areal = længde × bredde."
        };
      },


      rectanglePerimeter() {

        const max =
          session.difficulty === "hard"
            ? 50
            : 25;

        const width =
          randomInt(2, max);

        const height =
          randomInt(2, max);

        return {
          title:
            "Find rektanglets omkreds",

          problem:
            `
            <div class="geometry-lines">
              Længde: ${width} cm<br>
              Bredde: ${height} cm
            </div>
            `,

          answer:
            `${2 * width + 2 * height} cm`,

          instruction:
            "Læg alle fire sider sammen."
        };
      },


      triangleArea() {

        const base =
          randomInt(2, 20) * 2;

        const height =
          randomInt(2, 15);

        return {
          title:
            "Find trekantens areal",

          problem:
            `
            <div class="geometry-lines">
              Grundlinje: ${base} cm<br>
              Højde: ${height} cm
            </div>
            `,

          answer:
            `${base * height / 2} cm²`,

          instruction:
            "Areal = grundlinje × højde ÷ 2."
        };
      },


      square() {

        const side =
          randomInt(
            2,
            session.difficulty === "hard"
              ? 30
              : 15
          );

        const askArea =
          Math.random() < 0.5;

        if (askArea) {

          return {
            title:
              "Find kvadratets areal",

            problem:
              `Sidelængde: ${side} cm`,

            answer:
              `${side * side} cm²`,

            instruction:
              "Areal = side × side."
          };
        }

        return {
          title:
            "Find kvadratets omkreds",

          problem:
            `Sidelængde: ${side} cm`,

          answer:
            `${side * 4} cm`,

          instruction:
            "Et kvadrat har fire lige lange sider."
        };
      }
    }
  }
};


// ============================================================
// MODULE UI
// ============================================================

function renderModules() {

  moduleGrid.innerHTML = "";

  Object.entries(modules)
    .forEach(
      ([moduleKey, module]) => {

        const button =
          document.createElement("button");

        button.type = "button";

        button.className =
          "module-card";

        button.innerHTML = `
          <div class="module-icon">
            ${module.icon}
          </div>

          <h3>${module.title}</h3>

          <p>${module.description}</p>
        `;

        button.addEventListener(
          "click",
          () =>
            selectModule(
              moduleKey,
              button
            )
        );

        moduleGrid.appendChild(button);
      }
    );
}


function selectModule(
  moduleKey,
  button
) {

  selectedModule =
    moduleKey;

  document
    .querySelectorAll(".module-card")
    .forEach(card => {
      card.classList.remove("selected");
    });

  button.classList.add("selected");

  const module =
    modules[moduleKey];

  selectedModuleTitle.textContent =
    module.title;

  exerciseType.innerHTML = "";

  Object.entries(module.exercises)
    .forEach(
      ([key, label]) => {

        const option =
          document.createElement("option");

        option.value = key;
        option.textContent = label;

        exerciseType.appendChild(option);
      }
    );

  optionsPanel.classList.remove("hidden");

  optionsPanel.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}


// ============================================================
// SESSION
// ============================================================

function startSession() {

  if (!selectedModule) {
    return;
  }

  session.module =
    selectedModule;

  session.exercise =
    exerciseType.value;

  session.difficulty =
    difficulty.value;

  session.total =
    Number(questionCount.value);

  session.current = 0;

  setupScreen.classList.add("hidden");

  finishedScreen.classList.add("hidden");

  trainingScreen.classList.remove("hidden");

  trainingModule.textContent =
    modules[session.module].title;

  nextQuestion();
}


function nextQuestion() {

  if (
    session.current >=
    session.total
  ) {

    finishSession();
    return;
  }

  session.current++;

  updateProgress();

  currentQuestion =
    generateQuestion();

  exerciseTitle.textContent =
    currentQuestion.title;

  problem.innerHTML =
    currentQuestion.problem;

  instruction.textContent =
    currentQuestion.instruction || "";

  answerBox.innerHTML = "";
  answerBox.classList.add("hidden");

  answerButton.textContent =
    "Vis facit";

  if (
    session.current ===
    session.total
  ) {

    nextButton.textContent =
      "Afslut træning";

  } else {

    nextButton.textContent =
      "Næste opgave";
  }
}


function generateQuestion() {

  const module =
    modules[session.module];

  let exercise =
    session.exercise;

  if (exercise === "mixed") {

    const available =
      Object.keys(module.generators);

    exercise =
      randomItem(available);
  }

  return module.generators[
    exercise
  ]();
}


function updateProgress() {

  progressText.textContent =
    `Opgave ${session.current} af ${session.total}`;

  const percentage =
    session.current /
    session.total *
    100;

  progressFill.style.width =
    `${percentage}%`;
}


function showAnswer() {

  if (!currentQuestion) {
    return;
  }

  answerBox.innerHTML =
    `
      <strong>Facit</strong>
      <br><br>
      ${currentQuestion.answer}
    `;

  answerBox.classList.remove("hidden");
}


function finishSession() {

  trainingScreen.classList.add("hidden");

  finishedScreen.classList.remove("hidden");

  finishedText.textContent =
    `Du har gennemført ${session.total} opgaver i ${modules[session.module].title}.`;
}


function goHome() {

  trainingScreen.classList.add("hidden");

  finishedScreen.classList.add("hidden");

  setupScreen.classList.remove("hidden");

  optionsPanel.classList.add("hidden");

  selectedModule = null;

  document
    .querySelectorAll(".module-card")
    .forEach(card => {
      card.classList.remove("selected");
    });
}


// ============================================================
// EVENTS
// ============================================================

startButton.addEventListener(
  "click",
  startSession
);


answerButton.addEventListener(
  "click",
  showAnswer
);


nextButton.addEventListener(
  "click",
  nextQuestion
);


quitButton.addEventListener(
  "click",
  () => {

    const leave =
      confirm(
        "Vil du afslutte denne træning?"
      );

    if (leave) {
      goHome();
    }
  }
);


repeatButton.addEventListener(
  "click",
  () => {

    session.current = 0;

    finishedScreen.classList.add(
      "hidden"
    );

    trainingScreen.classList.remove(
      "hidden"
    );

    nextQuestion();
  }
);


homeButton.addEventListener(
  "click",
  goHome
);


changeModuleButton.addEventListener(
  "click",
  () => {

    optionsPanel.classList.add(
      "hidden"
    );

    selectedModule = null;

    document
      .querySelectorAll(".module-card")
      .forEach(card => {
        card.classList.remove(
          "selected"
        );
      });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
);


// ============================================================
// START
// ============================================================

renderModules();