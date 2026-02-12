console.log(
  "Для знаходження всіх сторін та кутів прямокутного трикутника потрібно ввести:",
);
console.log("Два катети (leg, leg)");
console.log("Катет і гіпотенузу (leg, hypotenuse)");
console.log("Катет і прилеглий гострий кут(leg, adjacent angle)");
console.log("Катет і протилежний гострий кут (leg, opposite angle)");
console.log(
  "Гіпотенузу і гострий кут (hypotenuse, angle)  angle - це один із заданих кутів ",
);
console.log(
  "При введені кожного аргументу потрібно спочатку вказати значення, а тоді назву в дужках. При вказанні величин кутів використовувати градуси. ",
);
console.log('Наприклад: triangle\(4, "leg", 8, "hypotenuse"\)');

type TriangleResult = {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad * 180) / Math.PI;

function validateName(name: string, name2: string): boolean {
  if (
    ![
      "leg",
      "hypotenuse",
      "adjacent angle",
      "opposite angle",
      "angle",
    ].includes(name)
  ) {
    return false;
  }
  if (
    ![
      "leg",
      "hypotenuse",
      "adjacent angle",
      "opposite angle",
      "angle",
    ].includes(name2)
  ) {
    return false;
  }
  if (name == "leg" && name2 == "angle") {
    return false;
  }
  if (
    name == "hypotenuse" &&
    ["adjacent angle", "opposite angle", "hypotenuse"].includes(name2)
  ) {
    return false;
  }
  if (
    name == "adjacent angle" &&
    ["adjacent angle", "opposite angle", "hypotenuse", "angle"].includes(name2)
  ) {
    return false;
  }
  if (
    name == "opposite angle" &&
    ["adjacent angle", "opposite angle", "hypotenuse", "angle"].includes(name2)
  ) {
    return false;
  }
  if (
    name == "angle" &&
    ["adjacent angle", "opposite angle", "angle", "leg"].includes(name2)
  ) {
    return false;
  }
  return true;
}

function validateValue(
  value: number,
  name: string,
  value2: number,
  name2: string,
): boolean {
  if (name === "leg" && name2 === "hypotenuse" && value >= value2) {
    return false;
  }

  switch (name) {
    case "leg":
    case "hypotenuse":
      if (
        isNaN(value) ||
        value <= 0 ||
        Math.atan(value / value2) > 1.57079632679
      )
        return false;
      break;

    case "adjacent angle":
    case "opposite angle":
    case "angle":
      if (value <= 0 || value >= 90) return false;
      if (value < 0.000000000001) return false;
      break;
  }
  return true;
}
function fromTwoLegs(a: number, b: number): TriangleResult {
  const c = Math.sqrt(a * a + b * b);
  const alpha = radToDeg(Math.atan(a / b));
  const beta = 90 - alpha;

  return { a: a, b: b, c: c, alpha: alpha, beta: beta };
}

function fromLegAndHyp(a: number, c: number): TriangleResult {
  const b = Math.sqrt(c ** 2 - a ** 2);
  const alpha = radToDeg(Math.asin(a / c));
  const beta = 90 - alpha;

  return { a: a, b: b, c: c, alpha: alpha, beta: beta };
}

function fromLegAdjacent(a: number, beta: number): TriangleResult {
  const alpha = 90 - beta;
  const b = a * Math.tan(degToRad(beta));
  const c = a / Math.cos(degToRad(beta));

  return { a: a, b: b, c: c, alpha: alpha, beta: beta };
}

function fromLegOpposite(a: number, alpha: number): TriangleResult {
  const beta = 90 - alpha;
  const c = a / Math.sin(degToRad(alpha));
  const b = a * Math.tan(degToRad(beta));

  return { a: a, b: b, c: c, alpha: alpha, beta: beta };
}

function fromHypAndAngle(c: number, alpha: number): TriangleResult {
  const beta = 90 - alpha;
  const a = c * Math.sin(degToRad(alpha));
  const b = c * Math.cos(degToRad(alpha));

  return { a: a, b: b, c: c, alpha: alpha, beta: beta };
}

function showData(data: TriangleResult) {
  console.log("a = " + data.a);
  console.log("b = " + data.b);
  console.log("c = " + data.c);
  console.log("alpha = " + data.alpha);
  console.log("beta = " + data.beta);
}

function triangle(v1: number, n1: string, v2: number, n2: string): string {
  if (
    !validateName(n1, n2) ||
    !validateValue(v2, n2, v1, n1) ||
    !validateValue(v1, n1, v2, n2)
  ) {
    return "error";
  }

  const pair = [n1, n2].sort().join("|");

  switch (pair) {
    case "leg|leg":
      showData(fromTwoLegs(v1, v2));
      break;

    case "hypotenuse|leg":
      showData(n1 === "leg" ? fromLegAndHyp(v1, v2) : fromLegAndHyp(v2, v1));
      break;

    case "adjacent angle|leg":
      showData(
        n1 === "leg" ? fromLegAdjacent(v1, v2) : fromLegAdjacent(v2, v1),
      );
      break;

    case "leg|opposite angle":
      showData(
        n1 === "leg" ? fromLegOpposite(v1, v2) : fromLegOpposite(v2, v1),
      );
      break;

    case "angle|hypotenuse":
      showData(
        n1 === "hypotenuse" ? fromHypAndAngle(v1, v2) : fromHypAndAngle(v2, v1),
      );
      break;

    default:
      console.log("Дана комбінація не підтримується");
  }
  return "success";
}

const result = triangle(4, "leg", 8, "hypotenuse");
