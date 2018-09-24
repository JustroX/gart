let a = g.addParticle("fractal",{
	x:500,
	y:250,
	lifetime: 0,
	behavior_ops:
	{
		frequency: 3,
		distance: 30,
		max_gen: 3,
		newF: (o,i,f,gen) =>
		{
			return f+10;
		},
		newD: (o,i,d,gen)=>
		{
			return d*2.1;
		},
		genesis: (o, gen,i) =>
		{
			o.stroke = g.getStyleHSL(120*i/o.behavior_ops.frequency,100,50*(3-gen+1)/3);
			o.vx = 3*Math.cos(o.behavior_ops.direction+Math.PI/3);
			o.vy = 3*Math.sin(o.behavior_ops.direction+Math.PI/3);
		}
	},
	onstep: (o)=>
	{
		o.exclusion(0.0001*(5-o.behavior_ops.generation),1,1);
	}
})

g.addParticle("fractal",{
						lifetime: 120,
						behavior_ops: 
						{
							delay: 2000,
							max_gen: 3,
							distance: 0,
							frequency: 5,
							direction: -Math.PI/2,
							newR: (o)=>{return o.r*0.9},
							newD: (o,i,d) => {return 0.000000000001},
							newF: (o,i,f) => {return f},
							newDirection: (o,i,direction,gen) =>{
							  return  ( gen==0 ? 2 : 1)*((i - (o.behavior_ops.frequency-1)/2  )*Math.PI / o.behavior_ops.frequency) + direction },
							genesis : (o,gen,i) =>
							{
								o.behavior_ops.v = 1;
								o.behavior_ops.omega = 0.00000000002;
								// o.behavior_ops.direction += Math.PI*(Math.random() - 0.5)/20 ;
								var b = (o_)=>{
									if(o_.time <60 )
									{
										
									}
									o_.vx = 1*Math.cos(o_.behavior_ops.direction+Math.PI);
									o_.vy = 1*Math.sin(o_.behavior_ops.direction+Math.PI);
								}
								o.behaviors.push(b);
								// o.stroke = g.getStyleHSL(120/10*(10-gen+1) + 100*Math.random() ,100-20*Math.random() ,50-20*Math.random());
							}
						},
						r:2,
						y:300,
						stroke: "white",
					});

g.addParticle("normal",{
						x: 500, 
						y: 650,
						vy: -1,
						r: 1,
						behaviors:
						[
							(o)=>
							{
								o.x += 0.05*Math.sin( o.y / Math.PI/2);
								if(o.y%25==0)
								{
									console.log(o.y%70	);
									let dir = 1 - 2*Math.floor(2*Math.random());
									g.addParticle("normal",{
										r: 1,
										y: o.y,
										lifetime: 90+10*Math.random(),
										behavior_ops:
										{
											v: 2*Math.random(),
											direction: -Math.PI/2,
											omega: 0.000 ,
										},
										behaviors: ["spiral",(o_)=>{
											o_.behavior_ops.omega+=dir*0.003*Math.random();
										}]
									});
									
								}
							}
						]
					});