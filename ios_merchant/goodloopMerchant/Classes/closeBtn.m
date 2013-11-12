//
//  closeBtn.m
//  goodloopMerchant
//
//  Created by carlos Solis on 11/1/13.
//
//

#import "closeBtn.h"

@interface closeBtn()

@end



@implementation closeBtn


- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
    }
    
    return self;
}

-(void) awakeFromNib{
    
    // Initialization code
    [self addTarget:self action:@selector(touchUpInside) forControlEvents:UIControlEventTouchUpInside];
    
    ///[self setTitle:@"flash" forState:UIControlStateNormal];
    NSLog(@"awake from nib");
    
    
}

-(void)touchUpInside{

  
}



/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect
{
    // Drawing code
}
*/

@end












