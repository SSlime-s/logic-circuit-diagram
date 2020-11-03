interface PosText {
  x: number;
  y: number;
  text: string;
}

interface AllJoin {
  line: number[];
  and: number[];
  or: number[];
  not: number[];
  input: number[];
  output: number[];
}

interface Parts {
  lines: number[][];
  ands: number[][];
  ors: number[][];
  nots: number[][];
  inputName: PosText[];
  inputs: number[]
  outputName: PosText[];
  outputs: number[]
  dots: AllJoin[];
}

// interface PartsStatus {
//   lines: string[] | boolean[]
//   ands: string[] | boolean[]
//   ors: string[] | boolean[]
//   nots: string[] | boolean[]
//   inputs: string[] | boolean[]
//   outputs: string[] | boolean[]
//   dots: string[] | boolean[]
// }

export function MakeTable(parts: Parts) {
  // let partsFormula: PartsStatus = {
  //   lines: new Array(parts.lines.length),
  //   ands: new Array(parts.ands.length),
  //   ors: new Array(parts.ors.length),
  //   nots: new Array(parts.nots.length),
  //   inputs: new Array(parts.inputs.length),
  //   outputs: new Array(parts.inputs.length),
  //   dots: new Array(parts.dots.length)
  // }
  const dotsFormula: string[] = new Array(parts.dots.length)
  const dotsBool: boolean[][] = new Array(2**(parts.inputs.length))

  let pow2 = 0
  for(let idx=0; idx < dotsBool.length; idx++){
    dotsBool[idx] = new Array(parts.dots.length)
    let pow2tmp = pow2
    parts.inputs.forEach(v => {
      dotsBool[idx][v] = (pow2tmp & 1) ? true : false
      pow2tmp >>= 1
    })
    pow2 += 1
  }

  interface DFS {
    formula: string
    idx: number
  }
  const count = {
    and: new Array(parts.lines.length),
    or: new Array(parts.ors.length)
  }
  count.and.fill(0)
  count.or.fill(0)

  const dfs: DFS[] = []
  parts.inputName.forEach((name, idx) => {
    dfs.push({
      formula: name.text,
      idx: parts.inputs[idx]
    })
    dotsFormula[parts.inputs[idx]] = name.text
  })

  while( dfs.length ){
    const nowDot: DFS = dfs.pop()!
    const idx = nowDot.idx
    const formula = nowDot.formula
    let cnt = 0
    parts.dots[idx].line.forEach((v) => {
      const nxt = (parts.lines[v][0] !== idx) ? parts.lines[v][0] : parts.lines[v][1]
      if (dotsFormula[nxt]){
        cnt++
      } else {
        dotsFormula[nxt] = formula
        dotsBool.forEach((_, index) => {
          dotsBool[index][nxt] = dotsBool[index][idx] 
        })
        dfs.push({
          idx: nxt,
          formula: formula
        })
      }
    })
    parts.dots[idx].not.forEach(v => {
      if (parts.nots[v][1] === idx){
        cnt++
        return
      }
      const nxt = parts.nots[v][1]
      if (dotsFormula[nxt]){
        cnt++
      } else {
        dotsFormula[nxt] = `¬(${formula})`
        dotsBool.forEach((_, index) => {
          dotsBool[index][nxt] = !dotsBool[index][idx] 
        })
        dfs.push({
          idx: nxt,
          formula: dotsFormula[nxt]
        })
      }
    })
    parts.dots[idx].and.forEach(v => {
      if (parts.ands[v][2] === idx){
        cnt++
        return
      }
      const from1 = dotsFormula[parts.ands[v][0]]
      const from2 = dotsFormula[parts.ands[v][1]]
      if (!from1 || !from2) return
      const nxt = parts.ands[v][2]
      if (dotsFormula[nxt]){
        cnt++
      } else {
        dotsFormula[nxt] = `(${from1})∧(${from2})`
        dotsBool.forEach((_, index) => {
          dotsBool[index][nxt] = dotsBool[index][parts.ands[v][0]] && dotsBool[index][parts.ands[v][1]]
        })
        dfs.push({
          idx: nxt,
          formula: dotsFormula[nxt]
        })
      }
    })
    parts.dots[idx].or.forEach(v => {
      if (parts.ors[v][2] === idx){
        cnt++
        return
      }
      const from1 = dotsFormula[parts.ors[v][0]]
      const from2 = dotsFormula[parts.ors[v][1]]
      if (!from1 || !from2) return
      const nxt = parts.ors[v][2]
      if (dotsFormula[nxt]){
        cnt++
      } else {
        dotsFormula[nxt] = `(${from1})∨(${from2})`
        dotsBool.forEach((_, index) => {
          dotsBool[index][nxt] = dotsBool[index][parts.ors[v][0]] || dotsBool[index][parts.ors[v][1]]
        })
        dfs.push({
          idx: nxt,
          formula: dotsFormula[nxt]
        })
      }
    })
    if (cnt > 1){
      console.error("Detect Loop !")
    }
  };
  parts.outputs.forEach((out, idx) => {
    const name = parts.outputName[idx].text
    const formula = dotsFormula[out]
  });
  // console.log(dotsBool)
  // console.log(dotsFormula)
  // console.log(parts)
  return {formula:dotsFormula, bool:dotsBool}
}
