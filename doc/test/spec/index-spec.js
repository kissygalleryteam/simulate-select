KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('simulate-select', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/simulate-select/2.0.0/']});