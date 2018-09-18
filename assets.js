var particles  =
{
	"normal": 
	{
		x: 500 ,
		y: 500 ,
		r: 5,
		style: "white",
		stroke: "rgba(0,0,0,0)"
	},
	"fractal":
	{
		x: 500,
		y: 250,
		r: 30,
		id : "fractal",
		stroke: "yellow",
		style: "rgba(0,0,0,0)",
		behaviors: ["fractal"],
		lifetime: 10,
		behavior_ops:
		{
			generation: 0,
			direction : 0,
			max_gen : 4,
			distance: 100,
			frequency: 4,
		}
	}
};


var behaviors = 
{
	random_walk : (o)=>
	{
		// console.log(o);
		ops.mag = ops.mag || 1;
		o.x += ops.mag*Math.random() - ops.mag/2;
		o.y += ops.mag*Math.random() - ops.mag/2;	
	},
	fractal : (o) =>
	{
		if(o.time!=0)
			return;
		let g = o.parent;
		let ops = o.behavior_ops;
		let gen = ops.generation;
		let direction = ops.direction;
		let max_gen = ops.max_gen;
		let d = ops.distance;
		let f = ops.frequency;
		let def = ((o_,i)=>{
			let angle = (ops.newDirection && ops.newDirection(o_,i,direction,gen)) || (((gen == 0)? 2: 1) * ( i - (f-1)/2  )*Math.PI / f + direction);
			let a = {
				x : ( ops.newX && ops.newX(o_,i,o,gen.x,angle) ) || (o.x + d*Math.cos(angle)),
				y : ( ops.newY && ops.newY(o_,i,o,gen.y,angle) ) || (o.y + d*Math.sin(angle)),
				r :  ( ops.newR && ops.newR(o_,i,o,gen.r,angle) ) ||(o.r /2),
				onstep: o.onstep,
				draw : o.draw,
				behavior_ops: 
				{
					distance : ( ops.newD && ops.newD(o_,i,d,gen, angle) ) || (d/2),
					generation : gen + 1, 
					direction: angle,
					max_gen: max_gen,
					frequency: ( ops.newF && ops.newF(o_,i,f,gen,angle) ) || f,
					genesis: ops.genesis,

					newX: ops.newX,
					newY: ops.newY,
					newR: ops.newR,
					newDirection: ops.newDirection,
					newD: ops.newD,
					newF: ops.newF,
				}
			}
			return a;
		});
		let on_genesis = ops.genesis;

		if(gen < max_gen && o.time == 0)
		setTimeout(()=>
		{
			for(let i =0 ; i<f; i++)
			{
				let new_vals  = def(o,i);
				let old_vals  = {};
				for( let i of ["x","y","r","vx","vy","style","stroke","ax","ay","tags","lifetime"] )
				{
					if(typeof o[i] != "function" && o[i] )
						old_vals[i] = o[i];
				}

				 for( let i in new_vals)
				 	old_vals[i] = new_vals[i];

				let a = g.addParticle(g.getParticle( o.id , old_vals));
				if(on_genesis) on_genesis(a,gen+1,i);
			}
		},1);
	},
	spiral : (o) =>
	{
		let ops = o.behavior_ops;
		ops.v = ops.v || 0.0003;
		ops.direction = (ops.direction + ops.omega ) || 0;
		o.vx = ops.v*Math.cos(ops.direction);
		o.vy = ops.v*Math.sin(ops.direction);

	}
}


var GArt_default = { particles: particles, behaviors: behaviors };