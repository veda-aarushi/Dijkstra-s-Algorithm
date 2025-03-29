function generateEdgeInputs() {
    const nodeCount = parseInt(document.getElementById("nodeCount").value);
    const edgeInputs = document.getElementById("edgeInputs");
    edgeInputs.innerHTML = "";
  
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const div = document.createElement("div");
        div.className = "flex items-center gap-4";
        div.innerHTML = `
          <span class="w-24">Edge ${i} → ${j}:</span>
          <input type="number" min="0" placeholder="Weight" class="flex-1 p-2 border rounded" data-edge="${i}-${j}">
        `;
        edgeInputs.appendChild(div);
      }
    }
  
    drawGraph(nodeCount, []);
  }
  
  function runDijkstra() {
    const nodeCount = parseInt(document.getElementById("nodeCount").value);
    const source = parseInt(document.getElementById("source").value);
    const inputs = document.querySelectorAll("#edgeInputs input");
    const resultBox = document.getElementById("result");
  
    const graph = Array.from({ length: nodeCount }, () => Array(nodeCount).fill(0));
    const edges = [];
  
    inputs.forEach(input => {
      const [i, j] = input.dataset.edge.split("-").map(Number);
      const weight = parseInt(input.value);
      if (!isNaN(weight)) {
        graph[i][j] = weight;
        graph[j][i] = weight;
        edges.push({ from: i, to: j, weight });
      }
    });
  
    const dist = Array(nodeCount).fill(Infinity);
    const prev = Array(nodeCount).fill(null);
    const visited = Array(nodeCount).fill(false);
    dist[source] = 0;
  
    for (let count = 0; count < nodeCount - 1; count++) {
      const u = minDistance(dist, visited);
      if (u === -1) break;
      visited[u] = true;
  
      for (let v = 0; v < nodeCount; v++) {
        if (!visited[v] && graph[u][v] !== 0 && dist[u] + graph[u][v] < dist[v]) {
          dist[v] = dist[u] + graph[u][v];
          prev[v] = u;
        }
      }
    }
  
    let result = '';
    for (let i = 0; i < nodeCount; i++) {
      result += `From node ${source} to ${i}: ${dist[i] === Infinity ? '∞' : dist[i]}\n`;
    }
    resultBox.textContent = result;
  
    const highlightEdges = [];
    for (let i = 0; i < nodeCount; i++) {
      if (prev[i] !== null) {
        highlightEdges.push({ from: prev[i], to: i, weight: graph[prev[i]][i] });
      }
    }
  
    drawGraph(nodeCount, edges, highlightEdges);
  }
  
  function minDistance(dist, visited) {
    let min = Infinity, index = -1;
    for (let i = 0; i < dist.length; i++) {
      if (!visited[i] && dist[i] <= min) {
        min = dist[i];
        index = i;
      }
    }
    return index;
  }
  
  function drawGraph(nodeCount, edges, highlightEdges = []) {
    const svg = document.getElementById("graphCanvas");
    svg.innerHTML = "";
  
    const centerX = 250;
    const centerY = 250;
    const radius = 180;
  
    const positions = Array.from({ length: nodeCount }).map((_, i) => {
      const angle = (2 * Math.PI * i) / nodeCount;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  
    // Draw edges
    edges.forEach(({ from, to, weight }) => {
      const p1 = positions[from];
      const p2 = positions[to];
  
      const isHighlighted = highlightEdges.some(e =>
        (e.from === from && e.to === to) ||
        (e.from === to && e.to === from)
      );
  
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", p1.x);
      line.setAttribute("y1", p1.y);
      line.setAttribute("x2", p2.x);
      line.setAttribute("y2", p2.y);
      line.setAttribute("stroke", isHighlighted ? "green" : "#ccc");
      line.setAttribute("stroke-width", isHighlighted ? 3 : 1);
      svg.appendChild(line);
  
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", (p1.x + p2.x) / 2);
      label.setAttribute("y", (p1.y + p2.y) / 2 - 5);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "14");
      label.setAttribute("fill", "#333");
      label.textContent = weight;
      svg.appendChild(label);
    });
  
    // Draw nodes
    positions.forEach(({ x, y }, i) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", 20);
      circle.setAttribute("fill", "#4F46E5");
      svg.appendChild(circle);
  
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y + 5);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("font-size", "16");
      text.setAttribute("fill", "white");
      text.textContent = i;
      svg.appendChild(text);
    });
  }
  